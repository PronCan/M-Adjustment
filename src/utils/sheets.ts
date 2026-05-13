import type { PlayConfig } from '../config';

// 간단한 CSV 파서 (따옴표 처리 포함)
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(current);
        current = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++;
        }
        row.push(current);
        result.push(row);
        row = [];
        current = '';
      } else {
        current += char;
      }
    }
  }
  
  if (current !== '' || row.length > 0) {
    row.push(current);
    result.push(row);
  }
  
  return result;
}

function extractSheetId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export async function fetchPlayDataFromSheets(sheetsUrl: string): Promise<PlayConfig[]> {
  const sheetId = extractSheetId(sheetsUrl);
  if (!sheetId) {
    throw new Error('유효하지 않은 구글 시트 URL입니다.');
  }

  const fetchSheet = async (sheetName: string) => {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`시트 데이터를 불러오는데 실패했습니다: ${sheetName}`);
    }
    const text = await response.text();
    // HTML이 반환되면 (공개되지 않은 경우 등) 에러 처리
    if (text.trim().startsWith('<!DOCTYPE html>')) {
      throw new Error('시트가 웹에 게시되지 않았거나 접근 권한이 없습니다.');
    }
    return parseCSV(text);
  };

  try {
    const playsData = await fetchSheet('Plays');
    const castsData = await fetchSheet('Casts');
    const benefitsData = await fetchSheet('Benefits');

    const playsMap = new Map<string, PlayConfig>();

    // Parse Plays
    // Header: id, title, emoji, layout, packForty, packFifty, packProof
    const playsHeaders = playsData[0].map(h => h.trim().toLowerCase());
    const idIdx = playsHeaders.indexOf('id');
    const titleIdx = playsHeaders.indexOf('title');
    const emojiIdx = playsHeaders.indexOf('emoji');
    const layoutIdx = playsHeaders.indexOf('layout');
    const packFortyIdx = playsHeaders.indexOf('packforty');
    const packFiftyIdx = playsHeaders.indexOf('packfifty');
    const packProofIdx = playsHeaders.indexOf('packproof');

    for (let i = 1; i < playsData.length; i++) {
      const row = playsData[i];
      if (row.length < 2 || !row[idIdx]) continue;
      
      const id = row[idIdx].trim();
      const layoutStr = row[layoutIdx]?.trim().toLowerCase();
      const layout = ['dream2', 'bugs', 'payco', 'none'].includes(layoutStr) ? layoutStr as any : 'none';
      
      const packForty = packFortyIdx >= 0 ? parseInt(row[packFortyIdx] || '1', 10) : 1;
      const packFifty = packFiftyIdx >= 0 ? parseInt(row[packFiftyIdx] || '1', 10) : 1;
      const packProof = packProofIdx >= 0 ? parseInt(row[packProofIdx] || '1', 10) : 1;

      playsMap.set(id, {
        id,
        title: row[titleIdx]?.trim() || '',
        emoji: emojiIdx >= 0 ? row[emojiIdx]?.trim() : undefined,
        layout,
        cast: {},
        rewatchBenefits: [],
        couponPackConfig: {
          forty: isNaN(packForty) ? 1 : packForty,
          fifty: isNaN(packFifty) ? 1 : packFifty,
          proofpass: isNaN(packProof) ? 1 : packProof
        }
      });
    }

    // Parse Casts
    // Header: playId, roleId, roleName, actors
    const castsHeaders = castsData[0].map(h => h.trim().toLowerCase());
    const cPlayIdIdx = castsHeaders.indexOf('playid');
    const cRoleIdIdx = castsHeaders.indexOf('roleid');
    const cRoleNameIdx = castsHeaders.indexOf('rolename');
    const cActorsIdx = castsHeaders.indexOf('actors');

    for (let i = 1; i < castsData.length; i++) {
      const row = castsData[i];
      if (row.length < 4 || !row[cPlayIdIdx]) continue;

      const playId = row[cPlayIdIdx].trim();
      const roleId = row[cRoleIdIdx]?.trim();
      const roleName = row[cRoleNameIdx]?.trim();
      const actorsStr = row[cActorsIdx]?.trim() || '';

      const play = playsMap.get(playId);
      if (play && roleId) {
        play.cast[roleId] = {
          role: roleName,
          actors: actorsStr.split(',').map(a => a.trim()).filter(a => a)
        };
      }
    }

    // Parse Benefits
    // Header: playId, count, label
    const benefitsHeaders = benefitsData[0].map(h => h.trim().toLowerCase());
    const bPlayIdIdx = benefitsHeaders.indexOf('playid');
    const bCountIdx = benefitsHeaders.indexOf('count');
    const bLabelIdx = benefitsHeaders.indexOf('label');

    for (let i = 1; i < benefitsData.length; i++) {
      const row = benefitsData[i];
      if (row.length < 3 || !row[bPlayIdIdx]) continue;

      const playId = row[bPlayIdIdx].trim();
      const count = parseInt(row[bCountIdx]?.trim() || '0', 10);
      const label = row[bLabelIdx]?.trim() || '';

      const play = playsMap.get(playId);
      if (play && !isNaN(count) && count > 0) {
        play.rewatchBenefits.push({ count, label });
      }
    }

    // Sort benefits by count
    for (const play of playsMap.values()) {
      play.rewatchBenefits.sort((a, b) => a.count - b.count);
    }

    return Array.from(playsMap.values());
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || '데이터를 파싱하는 중 오류가 발생했습니다.');
  }
}

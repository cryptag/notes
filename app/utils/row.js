import { tagByPrefix, tagByPrefixStripped } from './tags';

let ORIG_VERSION_ROW_PREFIX = "origversionrow:";

export function versionsOfSameRow(row1, row2){
  return (getVersionID(row1) === getVersionID(row2));
}

// The version ID is the ID-tag of the original version of the
// versioned Row
export function getVersionID(row){
  let vID = tagByPrefix(row.tags || row.plaintags, ORIG_VERSION_ROW_PREFIX, 'id:');
  if (vID.startsWith(ORIG_VERSION_ROW_PREFIX)){
    // Trim everything after the 'origversionrow:'
    vID = vID.substring(ORIG_VERSION_ROW_PREFIX.length);
  }
  return vID;
}

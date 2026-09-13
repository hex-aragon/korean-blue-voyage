// Fictional carrier workflow, not a real negotiable document.
export function verifyManifest(m,quantity){if(m.phase!=='loading'||Number(quantity)!==(m.units||6))return false;m.manifestChecked=true;return true;}
export function issueBill(m){if(m.phase!=='loading'||!m.manifestChecked)return false;m.phase='sailing';m.billIssued=true;return true;}
export function releaseCargo(m,consignee,regionId){if(!m.billIssued||m.phase==='loading'||regionId!==m.destinationRegion||consignee!==m.name)return false;m.releaseChecked=true;return true;}
export function settleFreight(m){if(!m.billIssued||!m.releaseChecked||m.settled)return null;const freight=m.reward,portFee=Math.round(freight*.08),safetyBonus=(m.voyageDamage||0)<1?Math.round(freight*.1):0;m.settled=true;return {freight,portFee,safetyBonus,total:freight-portFee+safetyBonus};}
export function restoreShipping(m,saved={}){m.manifestChecked=!!saved.manifestChecked;m.billIssued=m.phase!=='loading';m.releaseChecked=m.billIssued&&saved.releaseChecked===true;m.voyageDamage=Number.isFinite(saved.voyageDamage)?Math.max(0,Math.min(100,saved.voyageDamage)):0;return m;}

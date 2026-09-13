export function createBountyManager(state,definition,{isClaimed=()=>false}={}){
 return {
  claim(){
   if(!state.rustport.ironHoundDefeated)throw new Error('Iron Hound bounty is not defeated');
   if(isClaimed())return false;
   state.inventory.gold+=definition.reward.gold;
   state.inventory.scrap+=definition.reward.scrap;
   state.hunterRank+=definition.reward.hunterRank;
   return true;
  }
 };
}

export function createBountyManager(state,definition){
 return {
  claim(){
   if(!state.worldState.iron_hound_dead)throw new Error('Iron Hound bounty is not defeated');
   if(state.worldState.rustport_bounty_claimed)return false;
   state.inventory.gold+=definition.reward.gold;
   state.inventory.scrap+=definition.reward.scrap;
   state.hunterRank+=definition.reward.hunterRank;
   state.worldState.rustport_bounty_claimed=true;
   return true;
  }
 };
}

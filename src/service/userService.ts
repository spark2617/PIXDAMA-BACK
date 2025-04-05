import { findUserIdByid, updateMatchAfterDeposit } from '../supabase/user.supabase';

export const incrementMatchAfterDeposit = async (id: number | string) => {
  const { data: user, error: findError } = await findUserIdByid(id);

  if (findError || !user) {
    throw new Error('User not found or failed to fetch user data');
  }

  const current = user.quant_match_after_deposit || 0;
  const updatedValue = current + 1;

  const { data: updatedUser, error: updateError } = await updateMatchAfterDeposit(id, updatedValue);

  if (updateError) {
    throw new Error('Failed to update quant_match_after_deposit');
  }

  return updatedUser;
};

export const resetMatchAfterDeposit = async (id:string|number)=>{
  const { data: user, error: findError } = await findUserIdByid(id);

  if (findError || !user) {
    throw new Error('User not found or failed to fetch user data');
  }

  const current = user.quant_match_after_deposit || 0;
  const updatedValue = 0;

  const { data: updatedUser, error: updateError } = await updateMatchAfterDeposit(id, updatedValue);

  if (updateError) {
    throw new Error('Failed to update quant_match_after_deposit');
  }

  return updatedUser;
}
import { Address, BigInt, BigDecimal, Bytes, Entity } from '@graphprotocol/graph-ts'
import { User } from "../generated/schema"


/**
 * @name getUser
 * @param address
 */
export function getUser(address: Address): User {
  let addressId = address.toHexString()
  let ENTITY_USER = User.load(addressId);
  if (ENTITY_USER == null) {
    ENTITY_USER = new User(addressId);
    ENTITY_USER.address = address
    ENTITY_USER.shares = new BigInt(0)
  }
  return ENTITY_USER!;
}

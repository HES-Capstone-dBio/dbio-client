import * as IronWeb from "@ironcorelabs/ironweb";

/**
 * Initialize the IronWeb SDK as the provider associated with a given JWT
 */
export const initializeIroncoreUser = (jwt, passcode) => {
  return IronWeb.initialize(() => Promise.resolve(jwt), () => Promise.resolve(passcode));
}

// User schema
export interface IUser {
  id: number;
  name: string;
  publicKey: string;
}

/**
 * Get a new User object.
 *
 * @returns
 */
function getNew(name: string, publicKey: string): IUser {
  return {
    id: -1,
    publicKey,
    name,
  };
}

// Export default
export default {
  new: getNew,
};

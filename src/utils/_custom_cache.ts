import Discord from 'discord.js';
import { Snowflake } from "discord.js";

interface CacheEntry<T> {
  value: T;
  expiration: Date;
}

/**
 * Custom Implementation of Discord.Collection to append an expiration time to all items.
 */
class CustomCache<T> extends Discord.Collection<Snowflake, CacheEntry<T>> {
  /**
  * Add a key to the collection with an expiration time.
  * @param key The key of the collection item.
  * @param value The value of the collection item.
  * @param expirationMs How long should this item be kept in the collection (in ms)?
  * @returns void
  * 
  */
  setWithExpiration(key: string, value: T, expirationMs: number) {
    this.set(key, { value, expiration: new Date(Date.now() + expirationMs) });
  }

  /**
   * Check if a key is expired 
   * @param key The key of the collection item.
   * @returns boolean
   */
  hasExpired(key: string) {
    const entry = this.get(key);
    return entry && entry.expiration.getTime() < Date.now();
  }
  
  /**
   * Get an entry from the collection
   * @param key The key of the collection item
   * @returns <T>
   */
  getEntryValue(key: string): T | undefined {
    const entry = this.get(key);
    return entry?.value;
  }
}

export default CustomCache;
import Discord from 'discord.js';
import { Snowflake } from "discord.js";

interface CacheEntry<T> {
    value: T;
    expiration: Date;
  }

  class CustomCache<T> extends Discord.Collection<Snowflake, CacheEntry<T>> {
    setWithExpiration(key: string, value: T, expirationMs: number) {
      this.set(key, { value, expiration: new Date(Date.now() + expirationMs) });
    }
  
    hasExpired(key: string) {
      const entry = this.get(key);
      return entry && entry.expiration.getTime() < Date.now();
    }
  
    getEntryValue(key: string): T | undefined {
      const entry = this.get(key);
      return entry?.value;
    }
  }
  
  export default CustomCache;
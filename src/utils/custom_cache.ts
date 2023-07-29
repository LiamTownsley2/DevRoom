import Discord from 'discord.js';
import { Collection, Snowflake } from "discord.js";
import { GuildConfig } from '../types';

interface CacheEntry<T> {
    value: T;
    expiration: number;
  }

  class CustomCache<T> extends Discord.Collection<Snowflake, CacheEntry<T>> {
    setWithExpiration(key: string, value: T, expirationMs: number) {
      this.set(key, { value, expiration: Date.now() + expirationMs });
    }
  
    hasExpired(key: string) {
      const entry = this.get(key);
      return entry && entry.expiration < Date.now();
    }
  
    getEntryValue(key: string): T | undefined {
      const entry = this.get(key);
      return entry?.value;
    }
  }
  
  export default CustomCache;
export class CaseInsensitiveMap<V> extends Map<string, V> {
  constructor(entries?: readonly (readonly [string, V])[] | null) {
    super(entries?.map(([key, value]) => [key.toUpperCase(), value]) ?? []);
  }

  override set(key: string, value: V): this {
    return super.set(key.toUpperCase(), value);
  }

  override has(key: string): boolean {
    return super.has(key.toUpperCase());
  }

  override get(key: string): V | undefined {
    return super.get(key.toUpperCase());
  }
}

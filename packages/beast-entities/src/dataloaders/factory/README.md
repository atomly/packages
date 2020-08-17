# Entity Loaders Factory

> TODO: Add description.

## Concerns ([excerpts taken from the DataLoader documentation](https://github.com/graphql/dataloader))

- [ ] Loading by alternative keys

    Occasionally, some kind of value can be accessed in multiple ways.
    For example, perhaps a "User" type can be loaded not only by an "id"
    but also by a "username" value. If the same user is loaded by both keys,
    then it may be useful to fill both caches when a user is loaded from either source:

    ```js
      const userByIDLoader = new DataLoader(async ids => {
        const users = await genUsersByID(ids)
        for (let user of users) {
          usernameLoader.prime(user.username, user) // Priming in the other DataLoader.
        }
        return users
      });

      const usernameLoader = new DataLoader(async names => {
        const users = await genUsernames(names)
        for (let user of users) {
          userByIDLoader.prime(user.id, user) // Priming in the other DataLoader.
        }
        return users
      });
    ```

- [ ] Clearing Cache

    In certain uncommon cases, clearing the request cache may be necessary.

    The most common example when clearing the loader's cache is necessary is after a mutation or update within the same request, when a cached value could be out of date and future loads should not use any possibly cached value.

    Here's a simple example using SQL UPDATE to illustrate.

    ```js
      // Request begins...
      const userLoader = new DataLoader(...)

      // And a value happens to be loaded (and cached).
      const user = await userLoader.load(4)

      // A mutation occurs, invalidating what might be in cache.
      await sqlRun('UPDATE users WHERE id=4 SET username="zuck"')
      userLoader.clear(4)

      // Later the value load is loaded again so the mutated data appears.
      const user = await userLoader.load(4)

      // Request completes.
    ```

- [ ] Memory consumption for long-lived DataLoaders

    **Custom Cache**. As mentioned above, DataLoader is intended to be used as a per-request cache. Since requests are short-lived, DataLoader uses an infinitely growing Map as a memoization cache. This should not pose a problem as most requests are short-lived and the entire cache can be discarded after the request completes.

    However this memoization caching strategy isn't safe when using a long-lived DataLoader, since it could consume too much memory. If using DataLoader in this way, you can provide a custom Cache instance with whatever behavior you prefer, as long as it follows the same API as Map.

    The example below uses an LRU (least recently used) cache to limit total memory to hold at most 100 cached values via the `lru_map` npm package.

    ```js
    import { LRUMap } from 'lru_map'

    const myLoader = new DataLoader(someBatchLoadFn, {
      cacheMap: new LRUMap(100)
    })
    ```

    More specifically, any object that implements the methods `get()`, `set()`, `delete()` and `clear()` methods can be provided. This allows for custom Maps which implement various cache algorithms to be provided.

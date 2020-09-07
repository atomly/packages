// Types
import { IHubfulService } from './HubfulService';

// Dependencies
import { DefaultHubfulService } from './DefaultHubfulService';

class HubfulSingleton extends DefaultHubfulService implements IHubfulService {
  private static instance: HubfulSingleton; // Member variable that will store the OnlyOne instance.

  /**
   * Private constructor to instantiate a singleton.
   */
  private constructor() {
    super();
  }

  /**
   * If get instance has not been initialized then it will construct a new Hubful class object,
   * then store it into the instance property. If it has already been created then it will simply
   * return the instance property.
   * This assures that there will only ever be one instance.
   */
  static getInstance(): HubfulSingleton {
    if (!HubfulSingleton.instance) {
      HubfulSingleton.instance = new HubfulSingleton();
    }
    return HubfulSingleton.instance;
  }
}

export default HubfulSingleton.getInstance();

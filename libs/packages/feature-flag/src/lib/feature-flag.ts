import { FFConfig } from './models/feature-flag-config.model';
import { Feature } from './models/feature.model';
import { Observable, Observer, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';

class FeatureFlagClass {
  features: Observable<Feature[]>;
  private config: FFConfig;
  public data$: Subject<Feature[]> = new Subject();

  /**
   * Initialization
   * @param {FFConfig} config
   */
  async init(config: FFConfig): Promise<void> {
    if (!config.url) {
      throw new Error('url was not provided.');
    }

    this.config = config;

    this.features = this.getFeatures();
  }

  /**
   * Get a list of feature names
   * @param {String} featureName
   * @return {Feature[]}
   */
  isFeatureEnabled(featureName: string): Observable<Feature | boolean> {
    return this.data$.pipe(
      map(items => {
        const feature = items.find((item: Feature) => item.name === featureName);

        if (feature.type === 'B') {
          return JSON.parse(feature.value);
        }

        return feature;
      })
    );
  }

  /**
   * Get a list of feature names
   * @param {String} featureName
   * @return {Feature[]}
   */
  getFeatures(): Observable<Feature[]> {
    return new Observable<Feature[]>((observer: Observer<Feature[]>) => {
      timer(0, 5000).subscribe(() => {
        this.fetchFeature();
      });
    });
  }

  getFeature(featureName: string): Observable<Feature> {
    return this.data$.pipe(
      map(items => {
        const feature = items.find((item: Feature) => item.name === featureName);
        return feature;
      })
    );
  }

  fetchFeature(): Promise<void | Feature[]> {
    const apiUrl = this.config.url;

    return fetch(apiUrl, {
      method: 'post',
      body: JSON.stringify({}),
    })
    .then(this.handleErrors)
    .then((response: Response) => response.json())
    .then((response: Feature[]) => {
      this.data$.next(response);
      return response;
    })
    .catch((err) => this.data$.error(err));
  }

  private handleErrors(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response;
  }
}

export const FeatureFlag = new FeatureFlagClass();

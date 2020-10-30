import { FFConfig } from './models/config.model';
import { Feature } from './models/feature.model';
import { Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';

class FeatureFlagClass {
  config: FFConfig;
  subject = new Subject<Feature[]>();
  controller = new AbortController();
  signal = this.controller.signal;

  init(config: FFConfig) {
    if (!config.url) {
      throw new Error('url was not provided.');
    }

    this.config = new FFConfig(
      config.url,
      config.interval ? config.interval : 3000
    );

    this.fetchFeatures();
  }

  fetchFeatures() {
    timer(0, this.config.interval).subscribe(() => {
      this.fetchRequest();
    });
  }

  fetchRequest() {
    const apiUrl = this.config.url;

    fetch(apiUrl, {
      method: 'post',
      body: JSON.stringify({}),
      signal: this.signal
    })
    .then(this.handleErrors)
    .then((response: Response) => response.json())
    .then((response: Feature[]) => {
      this.sendFeatures(response);

      return response;
    })
    .catch((err) => this.subject.error(err));
  }

  sendFeatures(features: Feature[]) {
    this.subject.next(features);
  }
  
  clearFeatures() {
    this.subject.next();
  }

  getFeatures(): Observable<Feature[]> {
    return this.subject.asObservable();
  }

  getFeature(featureName: string): Observable<Feature> {
    return this.subject.pipe(
      map(items => {
        const feature = items.find((item: Feature) => item.name === featureName);
        return feature;
      })
    )
  }

  isFeatureEnabled(featureName: string): Observable<Feature | boolean> {
    return this.subject.pipe(
      map(items => {
        const feature = items.find((item: Feature) => item.name === featureName);

        if (feature.type === 'B') {
          return JSON.parse(feature.value);
        }

        return feature;
      })
    );
  }

  featureParseJSON(featureName: string): Observable<Feature> {
    return this.subject.pipe(
      map(items => {
        const feature = items.find((item: Feature) => item.name === featureName);

        if (feature.type === 'J') {
          return JSON.parse(feature.value);
        }

        return feature;
      })
    );
  }

  reload() {
    this.controller.abort();
    this.controller = new AbortController();
    this.signal = this.controller.signal;

    this.fetchRequest();
  }

  private handleErrors(response: Response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response;
  }
}

export const FeatureFlag = new FeatureFlagClass();

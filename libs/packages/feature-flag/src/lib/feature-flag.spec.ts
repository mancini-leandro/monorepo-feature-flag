import { take } from 'rxjs/operators';
import { FeatureFlag } from './feature-flag';
import { Feature } from './models/feature.model';
import * as fetchMock from 'fetch-mock';

jest.useFakeTimers();

describe('Feature Flag', () => {
    const url = 'https://gateway.service.ppay.me/flags/features';
    const initConfig = { url };
    const mockFeature = [
        { name: 'feature_boolean', type: 'B', value: 'true' },
        { name: 'feature_string', type: 'S', value: 'stringText' },
        { name: 'feature_json', type: 'J', value: '{"teste":123}' }
    ] as Feature[];

    afterEach(() => {
        jest.clearAllTimers();
    });
    
    it('should be created', () => {
        expect(FeatureFlag).toBeDefined();
    });

    it('should have a init function with invalid parameters', async () => {
        await expect(FeatureFlag.init({ url: null })).rejects.toThrow(
            'url was not provided.',
        );
    });

    it('should have a init function', async () => {
        const initSpy = jest.spyOn(FeatureFlag, 'init');

        await FeatureFlag.init(initConfig);

        expect(initSpy).toHaveBeenCalledWith(initConfig);
    });

    it('should feature enabled boolean', () => {
        const featureSpy = jest.spyOn(FeatureFlag, 'isFeatureEnabled');

        FeatureFlag.isFeatureEnabled('feature_boolean').subscribe((res: boolean) => {
            expect(res).toBeTruthy();
            expect(res).toBe(true);
        });

        expect(featureSpy).toHaveBeenCalled();

        FeatureFlag.data$.next(mockFeature);
    });

    it('should feature enabled string', () => {
        const featureSpy = jest.spyOn(FeatureFlag, 'isFeatureEnabled');

        FeatureFlag.isFeatureEnabled('feature_string').subscribe((res: Feature) => {
            expect(res.name).toEqual('feature_string');
            expect(res.type).toEqual('S');
            expect(res.value).toEqual('stringText');
        });

        expect(featureSpy).toHaveBeenCalled();

        FeatureFlag.data$.next(mockFeature);
    });

    it('should feature enabled json', () => {
        const featureSpy = jest.spyOn(FeatureFlag, 'isFeatureEnabled');

        FeatureFlag.isFeatureEnabled('feature_json').subscribe((res: Feature) => {
            expect(res.name).toEqual('feature_json');
            expect(res.type).toEqual('J');
            expect(res.value).toEqual('{"teste":123}');
        });

        expect(featureSpy).toHaveBeenCalled();

        FeatureFlag.data$.next(mockFeature);
    });

    it('should get feature', async () => {
        const getFeatureSpy = jest.spyOn(FeatureFlag, 'getFeature');

        FeatureFlag.getFeature('feature_boolean').subscribe((res: Feature) => {
            expect(res.name).toEqual('feature_boolean');
            expect(res.type).toEqual('B');
            expect(res.value).toEqual('true');
        });

        expect(getFeatureSpy).toHaveBeenCalled();

        FeatureFlag.data$.next(mockFeature);
    });
    
    it('should get features', async () => {
        const getFeaturesSpy = jest.spyOn(FeatureFlag, 'getFeatures');
        const fetchFeaturesSpy = spyOn(FeatureFlag, 'fetchFeature');

        FeatureFlag.getFeatures().subscribe(res => {
            expect(res).toBeTruthy();
            expect(fetchFeaturesSpy).toHaveBeenCalled();
        });

        expect(getFeaturesSpy).toHaveBeenCalled();

        jest.runOnlyPendingTimers();
    });
});
import { FFConfig } from "./config.model";

describe('FFConfig', () => {
    it('should be created', () => {
        const url = 'http://localhost:1500/flags/features';
        const config = new FFConfig(url, 3000);

        expect(config).toBeTruthy();
    });
});
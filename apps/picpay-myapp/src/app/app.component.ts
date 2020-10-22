import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay-myapp/packages/feature-flag';

@Component({
  selector: 'picpay-myapp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Feature Flags';

  getFeatures = FeatureFlag.getFeatures();
  featureParseJSON = FeatureFlag.featureParseJSON('feature_onboarding_carousel');
  isFeatureEnabled = FeatureFlag.isFeatureEnabled('feature_qrcode_bills');
  feature_boolean = FeatureFlag.getFeature('feature_qrcode_bills');
  feature_string  = FeatureFlag.getFeature('feature_birthday_gift_message_3');
  feature_json  = FeatureFlag.getFeature('teste');

  constructor() {
    FeatureFlag.init({
      url: 'http://localhost:1500/flags/features',
      interval: 10000
    });
  }

  reload() {
    FeatureFlag.reload();
  }
}

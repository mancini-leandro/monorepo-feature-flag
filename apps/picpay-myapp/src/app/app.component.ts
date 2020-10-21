import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay-myapp/packages/feature-flag';

@Component({
  selector: 'picpay-myapp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Feature Flags';
  features = FeatureFlag.features;
  feature_qrcode_bills = FeatureFlag.getFeature('feature_qrcode_bills');
  isEnabled = FeatureFlag.isFeatureEnabled('feature_qrcode_bills');
  feature_cpf_in_use_dialog = FeatureFlag.getFeature('feature_cpf_in_use_dialog');
}

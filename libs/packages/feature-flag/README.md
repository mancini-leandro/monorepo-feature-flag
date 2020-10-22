
# Feature Flag

Uma biblioteca de sinalizadores de recursos dinâmicos. Essa biblioteca oferece controle sobre a implementação e o teste de novos recursos. Permite controlar quando você lança novos recursos em seu aplicativo, colocando-os atrás de sinalizadores / interruptores de recursos.

A ideia por trás dos sinalizadores de recurso é que eles fornecem uma maneira de testar o novo código e acelerá-lo ao longo do tempo.

## Getting Started

### Instalação

Se seu projeto já está dentro do monorepo, basta importar o FeatureFlag onde precisar.

```typescript
import { FeatureFlag } from '@picpay/feature-flag';
```

Caso seu projeto esteja fora do monorepo, instale a biblioteca via npm.

```typescript
npm install @picpay/feature-flag
```

### Como inicializar a lib no seu projeto

Usar sinalizadores de recursos é muito fácil. Inicie o serviço diretamente para solicitar os recursos.

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor() {
		FeatureFlag.init({
			isProd: environment.production
		});
	}
}
```

### Dados de recursos

Os dados dos recursos que conduzem o serviço do sinalizador de recurso é um formato json. Abaixo está um exemplo:

```json
[
	{ "name": "...", "type": "...", "value": "..." },
    ...
]
```

<table>
	<tr>
		<td><b>name</b<</td>
		<td>Um nome do recurso (visível apenas nos métodos <code>getFeature()</code> e <code>getFeatures()</code>)</td>
	</tr>
	<tr>
		<td><b>type</b<</td>
		<td>
			Os tipos de recursos são: <br>
			<code>B</code>: boolean <br>
			<code>S</code>: string <br>
			<code>J</code>: json <br>
		</td>
	</tr>
	<tr>
		<td><b>value</b<</td>
		<td>Os valores por default são retornados todos no formato <code>string</code> (visível apenas nos métodos <code>getFeature()</code> e <code>getFeatures()</code>)</td>
	</tr>
</table>


### Métodos disponíveis

```typescript
.init(config: FFConfig)
```

Inicia o serviço de recursos.

Parâmetro de entrada: `FFConfig`

```typescript
.isFeatureEnabled(featureName: string)
```
    
Verifica se o recurso é do tipo `boolean` e retorna um valor. Caso passe uma funcionalidade que não é do tipo `boolean` irá retorna o tipo `Feature`.

Parâmetro de entrada: `string`
Tipo de retorno: `Observable<Feature | boolean>`

```typescript
.featureParseJSON(featureName: string)
```
    
Verifica se o recurso é do tipo `json` e retorna um `Object | Array`. Caso passe uma funcionalidade que não é do tipo `json` irá retorna o tipo `Feature`.

Parâmetro de entrada: `string`
Tipo de retorno: `Observable<Feature | boolean>`

```typescript
.getFeatures()
```
    
Você pode obter uma lista de recursos diretamente como um `observable`. Irá retornar uma lista de recursos do tipo `Feature[]`

Tipo de retorno: `Observable<Feature[]>`

```typescript
.getFeature(featureName: string)
```
    
Você pode obter o recurso diretamente como um `observable`. Irá retornar um recurso do tipo `Feature`

Parâmetro de entrada: `string`
Tipo de retorno: `Observable<Feature>`

```typescript
.reload()
```
    
O método `reload` é usado para recarregar a lista de recursos.

### Exemplos de uso

#####  Retornando uma lista de recursos:

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	template: `
		<div *ngFor="let item of getFeatures | async">
			<p>Nome: {{item.name}}</p>
			<p>Tipo: {{item.type}}</p>
			<p>Valor: {{item.value}}</p>
		</div>
		
		<p>{{getFeatures | async | json}}</p>
		<!--
		[
			{ name: 'feature_boolean', type: 'B', value: 'true' },
			{ name: 'feature_string', type: 'S', value: 'stringText' },
			{ name: 'feature_json', type: 'J', value: '{"teste":123}' }
		]
		-->
	`,
})
export class AppComponent {
	getFeatures = FeatureFlag.getFeatures();
}
```

#####  Retornando um recurso:

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	template: `
		<p>{{feature_boolean | async | json}}</p>
		<!-- { "name": "feature_boolean", "type": "B", "value": "true" } -->

		<p>{{feature_string | async | json}}</p>
		<!-- { "name": "feature_string", "type": "S", "value": "Parabéns! Um bolo para celebrar seu aniversário 🍰" } -->
	
		<p>{{feature_json | async | json}}</p>
		<!-- { "name": "feature_json", "type": "J", "value": "{\"itens\":[{\"text\":\"Faça recargas de celular\"},{\"text\":\"Compre créditos do Uber, Steam e Level Up\"}]}" } -->
	`,
})
export class AppComponent {
	feature_boolean = FeatureFlag.getFeature('feature_boolean');
	feature_string = FeatureFlag.getFeature('feature_string');
	feature_json = FeatureFlag.getFeature('feature_json');
}
```

#####  Retornando um valor booleano:

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	template: `
		<p>{{(isFeatureEnabled | async) ? 'Mostrar' : 'Ocultar'}}</p>
		<!-- true || false -->
	`,
})
export class AppComponent {
	isFeatureEnabled = FeatureFlag.isFeatureEnabled('feature_boolean');
}
```

#####  Retornando um valor json:

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	template: `
		<p>{{featureParseJSON | async | json}}</p>
		<!-- { "itens": [ { "text": "Faça recargas de celular" }, { "text": "Compre créditos do Uber, Steam e Level Up" } ] } -->
	`,
})
export class AppComponent {
	featureParseJSON = FeatureFlag.featureParseJSON('feature_json');
}
```

#####  Retornando um valor json:

```typescript
import { Component } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	template: `
		<p>{{featureParseJSON | async | json}}</p>
		<!-- { "itens": [ { "text": "Faça recargas de celular" }, { "text": "Compre créditos do Uber, Steam e Level Up" } ] } -->
	`,
})
export class AppComponent {
	featureParseJSON = FeatureFlag.featureParseJSON('feature_json');
}
```

### packages-feature-flag

This library was generated with [Nx](https://nx.dev).

### Executando testes unitários

Execute `nx test packages-feature-flag` para executar os testes unitários.

# Feature Flag

Um módulo que permite controlar quando você lança novos recursos em seu aplicativo, colocando-os atrás de sinalizadores / interruptores de recursos.

Uma biblioteca de sinalizadores de recursos dinâmicos. Essa biblioteca oferece controle sobre a implementação e o teste de novos recursos.

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

Recomenda-se inicializar a biblioteca junto com a inicialização do projeto. Se o projeto for Angular, é recomendável fazer a inicialização no arquivo **main.ts**

```typescript
import { enableProdMode } from '@angular/core';
import { FeatureFlag } from '@picpay/feature-flag';

if (environment.production) {
	enableProdMode();
	FeatureFlag.enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err  =>  console.error(err));

FeatureFlag.init({
	isProd:  environment.production
}).catch(err  =>  console.error(err));
```

### Flag data

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
		<td>Um nome do recurso (visível apenas na lista de recursos)</td>
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
		<td>Os valores por default são retornados todos no formato <code>string</code></td>
	</tr>
</table>


### Métodos disponíveis

```typescript
isFeatureEnabled(featureName: string)
```
    
Verifica se o recurso está habilitado ou não. Caso passe um funcionalidade que não é do tipo `boolean` irá retorna o tipo `Feature`.

Parâmetro de entrada: `string`
Tipo de retorno: `Observable<Feature | boolean>`

```typescript
getFeatures()
```
    
Você pode obter uma lista de recursos diretamente como um `observable`.

Tipo de retorno: `Observable<Feature[]>`

```typescript
getFeature(featureName: string)
```
    
Você pode obter o recurso diretamente como um `observable`.

Parâmetro de entrada: `string`
Tipo de retorno: `Observable<Feature>`

```typescript
reload()
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
		<div *ngFor="let item of features | async">
			<p>Nome: {{item.name}}</p>
			<p>Tipo: {{item.type}}</p>
			<p>Valor: {{item.value}}</p>
		</div>
	`,
})
export class AppComponent {
	features = FeatureFlag.features;
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
		<p>{{(feature_qrcode_bills | async) | json}}</p>
		<!-- { "name": "feature_qrcode_bills", "type": "B", "value": "true" } -->
	`,
})
export class AppComponent {
	feature_qrcode_bills = FeatureFlag.getFeature('feature_qrcode_bills');
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
		<p>{{(isEnabled | async) ? 'Mostrar' : 'Ocultar'}}</p>
	`,
})
export class AppComponent {
	isEnabled = FeatureFlag.isFeatureEnabled('feature_qrcode_bills');
}
```


### Executando testes unitários

Execute `nx test packages-feature-flag` para executar os testes unitários.
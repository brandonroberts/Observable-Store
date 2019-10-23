import { Injectable, Inject } from '@angular/core';
import { StoreState } from '../core/store/customers.service';
import { ObservableStore } from '@codewithdan/observable-store';
import { REDUX_DEVTOOLS_EXTENSION, ReduxDevtoolsExtensionConnection, ReduxDevtoolsExtension, ReduxDevtoolsExtensionConfig } from '../shared/extension';
import { EMPTY, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExtensionService extends ObservableStore<StoreState> {
  private extensionConnection: ReduxDevtoolsExtensionConnection;

  constructor(@Inject(REDUX_DEVTOOLS_EXTENSION) private devtoolsExtension: ReduxDevtoolsExtension) {
    super({ trackStateHistory: true });

    this.sync();
  }

  init(config?: ReduxDevtoolsExtensionConfig) {
    if (!this.devtoolsExtension) {
      return EMPTY;
    }

    return new Observable(subscriber => {
      const connection = this.devtoolsExtension.connect(config);
      this.extensionConnection = connection;
      connection.init();

      connection.subscribe((change: any) => subscriber.next(change));
      return connection.unsubscribe;
    }).subscribe((action: any) => {
      if (action.type === 'DISPATCH') {
        if (action.payload.type === 'JUMP_TO_ACTION') {
          this.setState(JSON.parse(action.state), 'DEVTOOLS_JUMP');
        }
      }
    });
  }

  sync() {
    this.globalStateChanged.pipe(delay(100)).subscribe(() => {
      const lastItem = this.stateHistory.slice().reverse().shift();
      const { action, endState } = lastItem;

      if ( action !== 'DEVTOOLS_JUMP') {
        this.extensionConnection.send(action, endState);
      }
    });
  }
}

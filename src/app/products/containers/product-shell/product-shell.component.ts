import { Component, OnInit, OnDestroy } from '@angular/core';


import { Subscription, Observable } from 'rxjs';

import { Product } from '../../product';
import { ProductService } from '../../product.service';

// *NgRx
import { Store, select } from '@ngrx/store';
import * as  fromProduct from '../../state/product.reducer';
import * as productAction from './../../state/product.action';
import { takeWhile } from 'rxjs/operators';


@Component({
    templateUrl: './product-shell.component.html'
})
export class ProductShellComponent implements OnInit {


    /*  errorMessages$: Observable<string>;
     displayCode: boolean;
     selectedProduct: Product | null;
     componentActive = true;
     products$: Observable<Product[]>; */

    errorMessages$: Observable<string>;
    displayCode$: Observable<boolean>;
    selectedProduct$: Observable<Product>;
    componentActive = true;
    products$: Observable<Product[]>;

    constructor(
        private store: Store<fromProduct.ApplicationState>, // injecting store in the component
        private productService: ProductService) { }

    ngOnInit(): void {

        // !Using Effects
        this.store.dispatch(new productAction.LoadAction()); // intialzing the LoadAction class

        this.products$ = this.store.pipe(select(fromProduct.getProductsArrayPropertyFromFeatureSliceOfStateObject));
        this.errorMessages$ = this.store.pipe(select(fromProduct.getErrorPropertyFromFeatureSliceOfStateObject));
        this.selectedProduct$ = this.store.pipe(select(fromProduct.getCurrentProductPropertyFromFeatureSliceOfStateObject));
        this.displayCode$ = this.store.pipe(select(fromProduct.getShowProductCodePropertyFromFeatureSliceOfStateObject));
    }


    // !Using action action creator while dispatching an action -
    checkChanged(value: boolean): void {
        // !dispatching the action
        this.store.dispatch(new productAction.ToggleProductCodeAction(value));
    }

    // !Replacing old techniques with NgRx
    newProduct(): void { // ! here we r dispatching action (i.e- emitting events like we use to do in service concept)
        this.store.dispatch(new productAction.InitializeCurrentProductAction());
    }


    // !Using NgRx for component communication
    productSelected(product: Product): void { // ! here we r dispatching action (i.e- emitting events like we use to do in service concept)
        this.store.dispatch(new productAction.SetCurrentProductAction(product));
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../../recipes/recipe.service";
import {Recipe} from "../../recipes/recipe-list/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app-state";
import * as RecipeActions from "../../recipes/store/recipe.actions";


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  token!: string | null;
  tokenSub!: Subscription;

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService, private store: Store<AppState>) {
    this.tokenSub = this.store.select('authorization').pipe(map(state=>{return state.user})).subscribe(
      user => {
        if(this.token){
          this.token = user.token;
        }
      }
    )
  }

  fetchRecipes() {
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap(user => {
    //     return this.http.get<Recipe[]>('https://recipebook-2b443-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    //       {
    //         params: new HttpParams().set('auth', <string>user.token)
    //       })
    //   }),
    //   map(recipes => {
    //     return recipes.map(recipe => {
    //       return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
    //     });
    //   }),
    //   tap(recipes => {
    //     this.recipeService.setRecipes(recipes);
    //   })
    // );
    return this.http.get<Recipe[]>('https://recipebook-2b443-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      // {
      //   params: new HttpParams().set('auth', <string>this.token)
      // }
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        // this.recipeService.setRecipes(recipes);
        this.store.dispatch(new RecipeActions.SetRecipes(recipes));
      })
    )
  }
}

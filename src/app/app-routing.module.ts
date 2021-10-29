import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ManageComponent } from './manage/manage.component';
import { CardSceneComponent } from './components/card-scene/card-scene.component';
import { ExampleComponent } from './example/example.component';
import { ChooseNameComponent } from './choose-name/choose-name.component';
import { DisplayNameGuardService } from './choose-name/display-name.guard';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckBuilderComponent } from './deck-builder/deck-builder.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'games',
    component: ManageComponent,
  },
  {
    path: 'games/:game_uuid',
    component: GameComponent,
  },
  {
    path: 'card',
    component: CardSceneComponent,
  },
  {
    path: 'decks',
    component: DeckListComponent,
  },
  {
    path: 'decks/create',
    component: DeckBuilderComponent,
  },
  {
    path: 'decks/:deck_uuid',
    component: DeckBuilderComponent,
  },
  {
    path: 'example',
    component: ExampleComponent,
  },
  {
    path: 'who',
    component: ChooseNameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [DisplayNameGuardService],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SocialLoginModule } from 'angularx-social-login';
import { UserService } from './services/user.service';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardSceneComponent } from './components/card-scene/card-scene.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { ExampleComponent } from './example/example.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { DrawerService } from './components/drawer/drawer.service';
import { ChooseNameComponent } from './choose-name/choose-name.component';
import { DeckBuilderComponent } from './deck-builder/deck-builder.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { NavigationService } from './services/navigation.service';
import { SVGIconComponent } from './components/svgicon/svgicon.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { DialogService } from './components/dialog/dialog.service';
import {
  DialogComponent,
  DialogDirective,
} from './components/dialog/dialog.component';
import { LogoHeadComponent } from './components/logo-head/logo-head.component';
import { DefaultPipe } from './pipes/default.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    ManageComponent,
    CardSceneComponent,
    CardComponent,
    ExampleComponent,
    DrawerComponent,
    ChooseNameComponent,
    DeckBuilderComponent,
    DeckListComponent,
    BackButtonDirective,
    DialogDirective,
    SVGIconComponent,
    ConfirmationComponent,
    DialogComponent,
    LogoHeadComponent,
    DefaultPipe,
  ],
  imports: [
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    SocialLoginModule,
  ],
  providers: [UserService, DrawerService, NavigationService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}

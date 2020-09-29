import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IValute} from './interfaces/valute.interface';
import {DataService} from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private dataService: DataService) {
  }

  public isLoaded: boolean = false;

  public valute: IValute = {
  numCode: '',
  charCode: '',
  nominal: '',
  name: '',
  value: '',
  };

  private sources: string[] = ['first', 'second'];
  private activeSource: string = 'first';

  ngOnInit(): void {
    this.getSource(this.activeSource);
    setInterval( () => this.getSource(this.activeSource), 10000);
  }

  private getFirstSource(): void {
    this.dataService.getFirstSource()
      .subscribe(
        (valute: IValute) => this.successHandler(valute),
        (error: Error) => this.errorHandler(error)
      );
  }

  private getSecondSource(): void {
    this.dataService.getSecondSource()
      .subscribe(
        (valute: IValute) => this.successHandler(valute),
        (error: Error) => this.errorHandler(error)
      );
  }

  private successHandler(valute: IValute): void {
    console.log(`Курс Евро получен 1 к ${valute.value}`);
    this.valute = valute;
    this.isLoaded = true;
  }

  private errorHandler(error: Error): void {
    console.error(error);
    this.changeSource();
  }


  private getSource(activeSource: string): void {
    switch (activeSource) {
      case 'first':
        this.getFirstSource();
        break;
      case 'second':
        this.getSecondSource();
        break;
    }
  }

  private changeSource(): void {
    console.log('Источник изменен.');
    const indexSource: number = this.sources.indexOf(this.activeSource);

    if (indexSource < this.sources.length) {
      this.activeSource = this.sources[indexSource + 1];
    } else {
      this.activeSource = this.sources[0];
    }

    this.getSource(this.activeSource);

  }
}

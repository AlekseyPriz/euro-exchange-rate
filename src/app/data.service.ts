import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {IValute} from './interfaces/valute.interface';

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient) { }

  public getFirstSource(): Observable<IValute> {
    return this.httpClient.get('https://www.cbr-xml-daily.ru/daily_utf8.xml', {responseType: 'text'})
      .pipe(
        map(((data: string) => this.parseXmlResponce(data))),
        map(((data: any) => this.createValuteObject(data, 'xml')))
      );
  }

  public getSecondSource(): Observable<IValute> {
    return this.httpClient.get('https://www.cbr-xml-daily.ru/daily_json.js')
      .pipe(
        map(((data: any) => data.Valute['EUR'])),
        map(((data: object) => this.createValuteObject(data, 'json')))
      );
  }

  private parseXmlResponce(data): Element {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const arrayElements: Array<Element> = Array.from(xmlDoc.getElementsByTagName('Valute'));
    const eurElem: Element = arrayElements.filter(item => item.childNodes[1].childNodes[0].nodeValue === 'EUR')[0];

    return eurElem;
  }

  private createValuteObject(data, type: 'xml' | 'json'): IValute {

    if (type === 'json') {
      return {
        numCode: data.NumCode,
        charCode: data.CharCode,
        nominal: data.Nominal,
        name: data.Name,
        value: data.Value,
      };
    }

    if (type === 'xml') {
      return {
        numCode: data.childNodes[0].childNodes[0].nodeValue,
        charCode: data.childNodes[1].childNodes[0].nodeValue,
        nominal: data.childNodes[2].childNodes[0].nodeValue,
        name: data.childNodes[3].childNodes[0].nodeValue,
        value: data.childNodes[4].childNodes[0].nodeValue,
      };
    }
  };


}

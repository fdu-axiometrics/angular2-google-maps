import {provide} from '@angular/core';
import {beforeEachProviders, describe, expect, inject, it} from '@angular/core/testing';

import {LazyMapsAPILoader} from '../../../src/core/services/maps-api-loader/lazy-maps-api-loader';
import {MapsAPILoader} from '../../../src/core/services/maps-api-loader/maps-api-loader';

export function main() {
  describe('Service: LazyMapsAPILoader', () => {
    beforeEachProviders(() => {
      return [
        provide(MapsAPILoader, {useClass: LazyMapsAPILoader}), provide(Window, {useValue: {}}),
        provide(
            Document, {useValue: jasmine.createSpyObj<Document>('Document', ['createElement'])})
      ];
    });

    it('should create the default script URL',
       inject([MapsAPILoader, Document, Window], (loader: LazyMapsAPILoader, doc: Document) => {
         interface Script {
           src?: string;
           async?: boolean;
           defer?: boolean;
           type?: string;
         }
         const scriptElem: Script = {};
         (<jasmine.Spy>doc.createElement).and.returnValue(scriptElem);
         doc.body = jasmine.createSpyObj('body', ['appendChild']);

         loader.load();
         expect(doc.createElement).toHaveBeenCalled();
         expect(scriptElem.type).toEqual('text/javascript');
         expect(scriptElem.async).toEqual(true);
         expect(scriptElem.defer).toEqual(true);
         expect(scriptElem.src).toBeDefined();
         expect(scriptElem.src).toContain('https://maps.googleapis.com/maps/api/js');
         expect(scriptElem.src).toContain('v=3');
         expect(scriptElem.src).toContain('callback=angular2GoogleMapsLazyMapsAPILoader');
         expect(doc.body.appendChild).toHaveBeenCalledWith(scriptElem);
       }));
  });
}

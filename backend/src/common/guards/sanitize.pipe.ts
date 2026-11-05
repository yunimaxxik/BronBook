import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value) {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeObject(obj: any): any {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = DOMPurify.sanitize(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = this.sanitizeObject(obj[key]);
      }
    }
    return obj;
  }
}
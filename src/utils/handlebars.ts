import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

export function renderTemplate(templateName: string, data: unknown) {
  const filePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);

  const source = fs.readFileSync(filePath, 'utf8');

  const template = Handlebars.compile(source);

  return template(data);
}

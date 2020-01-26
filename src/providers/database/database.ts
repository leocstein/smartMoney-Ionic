import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {
  private dbConnection: SQLiteObject;

  constructor(
    public sqlite: SQLite) {
    this.initDB();
  }

  get db(): SQLiteObject {
    return this.dbConnection;
  }

  private initDB() {
    console.log('init db');

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.dbConnection = db;

      //this.dropTables();
      this.createTables();
      this.loadRecords();

      console.log('db created');
    })
    .catch(e => console.error('error on load db', JSON.stringify(e)));
  }

  // Criar as tabelas
  private createTables() {
    console.log('creating tables...');

    this.dbConnection.sqlBatch([
      ["CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, color CHARACTER(9) default '#ffffff', is_default BOOLEAN);"],
      ["CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL NOT NULL, description TEXT, entry_at DATETIME NOT NULL, is_init BOOLEAN, category_id INTEGER);"],
    ])
    .then(() => console.log('tables created successfully'))
    .catch(e => console.error('error on create tables', JSON.stringify(e)));
  }

  // Carregar os dados padrão
  private loadRecords() {
    console.log('loading default data...');

    this.dbConnection.executeSql('SELECT COUNT(id) AS qtd FROM categories', [])
      .then((data: any) => {
        console.log('categories in db', data.rows.item(0).qtd);

        //Se não existe nenhum registro
        if (data.rows.item(0).qtd == 0) {

          // Populando as tabelas iniciais
          this.dbConnection.sqlBatch([
            ['INSERT INTO categories (name, color) values (?, ?)', ['Lazer', '#6BBF59']],
            ['INSERT INTO categories (name, color) values (?, ?)', ['Alimentacao', '#08A045']],
            ['INSERT INTO categories (name, color) values (?, ?)', ['Combustivel', '#2DC7FF']],
            ['INSERT INTO categories (name, color) values (?, ?)', ['Educacao', '#FCDE11']],
            ['INSERT INTO categories (name, color) values (?, ?)', ['Outros', '#E47127']]
          ])
          .then(() => console.log('default categories added'))
          .catch(e => console.error('error on create default categories', JSON.stringify(e)));
        }
      })
      .catch(e => console.error('error on get categories quantity', JSON.stringify(e)));
  }

  private dropTables() {
    console.log('dropping tables...');

    this.dbConnection.sqlBatch([
      ["DROP TABLE entries;"],
      ["DROP TABLE categories;"],
    ])
    .then(() => console.log('tables dropped successfully'))
    .catch(e => console.error('error on drop tables', JSON.stringify(e)));
  }
}

'use stict';

import uuid from 'uuid/v4';
import storage from '../lib/storage/data-store.js';

class Cat {

  constructor(kitty) {
    this.id = uuid();
    this.breed = kitty.breed || '';
    this.color = kitty.color || '';
    this.ade = kitty.age || '';
  }

  static fetchAll() {
    return storage.fetchAll();
  }

  static fetchOne(id) {
    return storage.fetchOne(id);
  }

  static deleteOne(id) {
    return storage.delete(id);
  }

  save() {
    return storage.save(this);
  }
}

export default Cat;
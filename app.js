// Conference Class: Represents a Conference
class Conference {
  constructor(title, track, description) {
    this.title = title;
    this.track = track;
    this.description = description;
  }
}

// UI Class:Handle UI Tasks
class UI {
  static displayConferences() {
    // const Conferences = [
    //   {
    //     title: 'Conference One',
    //     track: 'CSE',
    //     description: 'About CSE Course',
    //   },
    //   {
    //     title: 'Conference Two',
    //     track: 'ECE',
    //     description: 'About ECE Course',
    //   },
    // ];

    const confs = Store.getConfs();

    confs.forEach((conf) => {
      UI.addConfToList(conf);
    });
  }

  static addConfToList(conf) {
    const list = document.querySelector('#conf-list');

    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${conf.title}</td>
            <td>${conf.track}</td>
            <td>${conf.description}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

    list.appendChild(row);
  }

  static deleteConf(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#conf-form');
    container.insertBefore(div, form);

    //Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#track').value = '';
    document.querySelector('#description').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getConfs() {
    let confs;
    if (localStorage.getItem('confs') === null) {
      confs = [];
    } else {
      confs = JSON.parse(localStorage.getItem('confs'));
    }

    return confs;
  }

  static addConf(conf) {
    const confs = Store.getConfs();
    confs.push(conf);

    localStorage.setItem('confs', JSON.stringify(confs));
  }

  static removeConf(title) {
    const confs = Store.getConfs();
    confs.forEach((conf, index) => {
      if (conf.title === title) {
        confs.splice(index, 1);
      }
    });
    localStorage.setItem('confs', JSON.stringify(confs));
  }
}

// Event: Display Conferences
document.addEventListener('DOMContentLoaded', UI.displayConferences);

// Event: Add Conference
document.querySelector('#conf-form').addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault();

  //Get form values
  const title = document.querySelector('#title').value;
  const track = document.querySelector('#track').value;
  const description = document.querySelector('#description').value;

  //Validate
  if (title === '' || track === '' || description === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    //Instantiate Conference
    const conference = new Conference(title, track, description);

    //Add Conference to UI
    UI.addConfToList(conference);

    //Add conference to store
    Store.addConf(conference);
    //Show Success Message
    UI.showAlert('Book Added', 'success');

    //Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#conf-list').addEventListener('click', (e) => {
  //Remove book from UI
  UI.deleteConf(e.target);

  //Remove book from store
  Store.removeConf(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );

  //Show Success Message
  UI.showAlert('Book Removed', 'success');
});

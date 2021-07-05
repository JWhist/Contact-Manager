/* eslint-disable max-lines-per-function */
import { API } from "./api.js";
import { contactsTemplate, emptySearchTemplate } from "./views.js";
const DB = new API();

class App {
  constructor() {
    this.currentContactId = ""; // used to prepopulate the edit form
    this.contacts = [];
  }

  loadContacts() {
    DB.getAll().then((contacts) => {
      // caching the response for use in the searchBox functionality
      this.contacts = contacts.sort((a, b) => a.full_name > b.full_name);
      $("#results").html(contactsTemplate({ contacts: contacts }));
    });
  }

  init() {
    $("#addContactForm").hide();
    $("#editContactForm").hide();
    this.loadContacts();
    this.addListeners();
  }

  addListeners() {
    $("body").on("click", () => {
      $("#results").html(contactsTemplate({ contacts: this.contacts }));
      $("#searchBox").val("");
    });

    $("body").on("click", ".cancel", (event) => {
      event.stopPropagation();
      $("#addContactForm").hide("fast");
      $("#editContactForm").hide("fast");
      $("#results").show("slow");
    });

    $("body").on("click", ".add", (event) => {
      event.stopPropagation();
      $("#results").hide("fast");
      $("#editContactForm").hide("fast");
      $("#addContactForm").show("slow");
    });

    $("body").on("click", ".edit", (event) => {
      event.stopPropagation();
      $("#results").hide("fast");
      $("#editContactForm").show("slow");
      this.currentContactId = event.target
        .closest(".edit")
        .getAttribute("data-id");
      DB.get(this.currentContactId).then((contact) => {
        $("#editContactForm form input[name='full_name']").val(
          contact.full_name
        );
        $("#editContactForm form input[name='email']").val(contact.email);
        $("#editContactForm form input[name='phone_number']").val(
          contact.phone_number
        );
        $("#editContactForm input[name='tags']").val(contact.tags);
      });
    });

    $("body").on("click", ".delete", (event) => {
      event.stopPropagation();
      this.currentContactId = event.target
        .closest(".edit")
        .getAttribute("data-id");
      DB.remove(this.currentContactId);
      this.loadContacts();
    });

    $("body").on("click", ".tag", (event) => {
      event.stopPropagation();
      let tag = event.target.closest(".tag").getAttribute("data-tag");
      let filteredContacts = this.contacts.filter((contact) => {
        return contact.tags && contact.tags.includes(tag);
      });
      $("#results").html(contactsTemplate({ contacts: filteredContacts }));
    });

    $("body").on("submit", "#addContactForm", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formData = JSON.stringify(
        Object.fromEntries(new FormData(event.target))
      );
      DB.add(formData);
      this.loadContacts();
      $("#addContactForm").hide("fast");
      $("#results").show("slow");
    });

    $("body").on("submit", "#editContactForm", (event) => {
      event.preventDefault();
      event.stopPropagation();
      let formData = JSON.stringify(
        Object.fromEntries(new FormData(event.target))
      );
      DB.update(this.currentContactId, formData);
      this.loadContacts();
      $("#editContactForm").hide("fast");
      $("#results").show("slow");
    });

    $("#searchBox").on("keyup", () => {
      let searchString = $("#searchBox").val();
      let pattern = new RegExp("(" + searchString + ")", "gi");
      let filteredContacts = this.contacts.filter((contact) => {
        return (
          contact.full_name.match(pattern) ||
          contact.tags.some((tag) => tag.match(pattern))
        );
      });

      if (filteredContacts.length === 0) {
        $("#results").html(emptySearchTemplate(searchString));
      } else {
        $("#results").html(contactsTemplate({ contacts: filteredContacts }));
        // [...$(".name, .tag")].forEach((el) => {
        //   if (pattern == "/()/gi") return; //do nothing if search box is empty/backspace
        //   let origText = el.innerHTML;
        //   let newText = origText.replace(pattern, "<mark>$1</mark>");
        //   el.innerHTML = newText;
        // });
      }
    });
  }
}

const Page = new App();
Page.init();

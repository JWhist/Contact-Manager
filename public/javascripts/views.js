const contactsTemplate = Handlebars.compile($("#contactsTemplate").html());
const contactTemplate = Handlebars.compile($("#contactTemplate").html());
const tagTemplate = Handlebars.compile($("#tagTemplate").html());
const emptySearchTemplate = Handlebars.compile(
  $("#emptySearchTemplate").html()
);

Handlebars.registerPartial("tag", tagTemplate);
Handlebars.registerPartial("contact", contactTemplate);

export { contactsTemplate, emptySearchTemplate };

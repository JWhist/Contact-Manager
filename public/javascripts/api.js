export class API {
  async getAll() {
    let contacts = await fetch("/api/contacts").then((res) => res.json());
    contacts.forEach((contact) => {
      contact.tags = contact.tags
        ? contact.tags.replace(/\s{2,}/g, "").split(/, |,/)
        : null;
    });
    return contacts;
  }

  async get(id) {
    let contact = await fetch(`/api/contacts/${id}`).then((res) => res.json());
    return contact;
  }

  async update(id, options) {
    await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: options,
    }).then((res) => res.json());
  }

  async remove(id) {
    await fetch(`/api/contacts/${id}`, { method: "DELETE" }).then((res) =>
      res.json()
    );
  }

  async add(contact) {
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: contact,
    }).then((res) => res.json());
  }
}

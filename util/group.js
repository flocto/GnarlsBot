// boo! its OOP
class Group {
    constructor(role, limit) {
        this.members = [];
        this.createdAt = new Date();
        this.modifiedAt = new Date();
        this.limit = limit;
        this.roleId = role;
    }

    addMember(member) {
        this.members.push(member);
        this.modifiedAt = new Date();
    }

    setLimit(limit) {
        this.limit = limit;
        this.modifiedAt = new Date();
    }

    clear() {
        this.members = [];
        this.modifiedAt = new Date();
    }
}

module.exports = {
    Group,
};

// boo! its OOP
class Group {
    constructor(role, limit) {
        this.members = []; // i dont want to both with sets/maps for now, this is easier since each group isn't > 20 members max anyway
        this.createdAt = new Date();
        this.modifiedAt = new Date();
        this.limit = limit;
        this.roleId = role;
    }

    addMember(member) {
        this.members.push(member);
        this.modifiedAt = new Date();
    }

    removeMember(member) {
        if (!this.isMember(member)) return; // silently fail
        this.members = this.members.filter((id) => id !== member); 
        this.modifiedAt = new Date();
    }

    isMember(member) {
        return this.members.includes(member);
    }

    setLimit(limit) {
        this.limit = limit;
        this.modifiedAt = new Date();
    }

    isFull(){
        return this.members.length === this.limit;
    }

    clear() {
        this.members = [];
        this.modifiedAt = new Date();
    }
}

module.exports = {
    Group,
};

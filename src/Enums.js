class Enums {
    static INFO = 0;
    static WARNING = 1;
    static ERROR = 2;
    static DEBUG = 3;

    static PARTY_PRIVATE = {
        partyType: 'Private',
        inviteRestriction: 'AnyMember',
        onlyLeaderFriendsCanJoin: false,
        presencePermission: 'Noone',
        invitePermission: 'Anyone',
        acceptingMembers: false,
    };

    static PARTY_PUBLIC = {
        partyType: 'Public',
        inviteRestriction: 'AnyMember',
        onlyLeaderFriendsCanJoin: false,
        presencePermission: 'Anyone',
        invitePermission: 'Anyone',
        acceptingMembers: true,
    };
}

export default Enums

import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
    socket: Socket;
    name: string;
    gender: string;
}

export class UserManager {
    private femaleUsers: User[];
    private maleUsers: User[];
    // private users: User[];
    private femaleQueue: string[];
    private maleQueue: string[];
    private roomManager: RoomManager = new RoomManager();
    
    constructor() {
        // this.users = [];
        this.femaleUsers=[];
        this.maleUsers=[];
        this.femaleQueue = [];
        this.maleQueue = [];
        this.roomManager = new RoomManager();
    }

    addUser(name: string, socket: Socket,gender : string) {
        // this.users.push({
        //     name, socket , gender
        // })
        const user: User = { name, socket, gender };
        if (gender === "male") {
            this.maleUsers.push(user);
            this.maleQueue.push(socket.id);
        } else if (gender === "female") {
            this.femaleUsers.push(user);
            this.femaleQueue.push(socket.id);
        }
        socket.emit("lobby");
        this.clearQueue();
        this.initHandlers(socket);
        // this.queue.push(socket.id);
        // socket.emit("lobby");
        // this.clearQueue()
        // this.initHandlers(socket);
    }

    removeUser(socketId: string,gender : string) {
        if (gender === "male") {
            this.maleUsers = this.maleUsers.filter(x => x.socket.id !== socketId);
            this.maleQueue = this.maleQueue.filter(x => x !== socketId);
        } else if (gender === "female") {
            this.femaleUsers = this.femaleUsers.filter(x => x.socket.id !== socketId);
            this.femaleQueue = this.femaleQueue.filter(x => x !== socketId);
        }
    }

    clearQueue() {
        while (this.maleQueue.length >= 1 && this.femaleQueue.length >= 1) {
            const id1 = this.maleQueue.pop();
            const id2 = this.femaleQueue.pop();
            if (!id1 || !id2) break;

            const user1 = this.maleUsers.find(x => x.socket.id === id1);
            const user2 = this.femaleUsers.find(x => x.socket.id === id2);
            if (user1 && user2) {
                this.roomManager.createRoom(user1, user2);
            }
        }
        while (this.maleQueue.length >= 2 && this.femaleQueue.length === 0) {
            const id1 = this.maleQueue.pop();
            const id2 = this.maleQueue.pop();
            if (!id1 || !id2) break;

            const user1 = this.maleUsers.find(x => x.socket.id === id1);
            const user2 = this.maleUsers.find(x => x.socket.id === id2);
            if (user1 && user2) {
                this.roomManager.createRoom(user1, user2);
            }
        }
        while (this.femaleQueue.length >= 2 && this.maleQueue.length === 0) {
            const id1 = this.femaleQueue.pop();
            const id2 = this.femaleQueue.pop();
            if (!id1 || !id2) break;

            const user1 = this.femaleUsers.find(x => x.socket.id === id1);
            const user2 = this.femaleUsers.find(x => x.socket.id === id2);
            if (user1 && user2) {
                this.roomManager.createRoom(user1, user2);
            }
        }
        // console.log("inside clear queues")
        // console.log(this.queue.length);
        // if (this.queue.length < 2) {
        //     return;
        // }

        // const id1 = this.queue.pop();
        // const id2 = this.queue.pop();
        // console.log("id is " + id1 + " " + id2);
        // const user1 = this.users.find(x => x.socket.id === id1);
        // const user2 = this.users.find(x => x.socket.id === id2);

        // if (!user1 || !user2) {
        //     return;
        // }
        // console.log("creating roonm");

        // const room = this.roomManager.createRoom(user1, user2);
        // this.clearQueue();
    }

    initHandlers(socket: Socket) {
        socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });

        socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });

        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }
}
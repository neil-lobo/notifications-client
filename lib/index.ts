import jsonwebtoken from "jsonwebtoken";

export interface MessageOptions {
    title?: string;
    message: string;
    from?: string;
    highlighted?: boolean;
}

export interface JWTPayload {
    user: string;
    labels: string[];
    iss: string;
    iat: number;
}

export class NotificationsClient {
    private token: string;
    private decodedToken: any;
    private url: URL | string;

    constructor(url: URL | string, token: string) {
        this.decodedToken = jsonwebtoken.decode(token);
        if (!this.decodedToken) {
            throw new Error("Invalid JWT");
        }

        this.url = url;
        this.token = token;
    }

    getDecodedToken(): JWTPayload {
        return this.decodedToken;
    }

    async notify(label: string, options: MessageOptions) {
        const res = await fetch(new URL("notify", this.url), {
            method: "POST",
            headers: {
                authorization: `Bearer ${this.token}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                label,
                options,
            }),
        });
        return res;
    }

    async getConnections() {
        const res = await fetch(new URL("connections", this.url), {
            headers: {
                authorization: `Bearer ${this.token}`,
            },
        });
        return res;
    }
}

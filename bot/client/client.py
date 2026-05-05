import requests

class Client:

    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()

        self.session.headers.update({
            "Content-Type" : "application/json"
            })

    def _request(self, method, endpoint, **kwargs):

        url = f"{self.base_url}/{endpoint}"
        response = self.session.request(method, url, **kwargs)

        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            raise Exception(f"API error: {response.status_code} - {response.text}") from err

        if response.headers.get("Content-Type", "").startswith("application/json"):
            return response.json()
        return response.text 

    def get(self, endpoint, params=None):
        return self._request("GET", endpoint, params=params)

    def post(self, endpoint, json=None):
        return self._request("POST", endpoint, json=json)

    def is_message_in_quotes(self, text):
        message = self.get(f"/quotes", params = {"text" : text });
        return message != [] 

    def add_quote(self, messageId, text):
        message = self.post(f"/quotes", {"id" : messageId, "text" : text})
        return message

from .baseapi import BaseAPI
from . import utils
from .errors import InvalidDataError







class Transaction(BaseAPI):
    def initialize(
        self, email, amount, plan=None, reference=None, channel=None, metadata=None
    ):
        """
        Initialize a transaction and returns the response
        args:
        email -- Customer's email address
        amount -- Amount to charge
        plan -- optional
        Reference -- optional
        channel -- channel type to use
        metadata -- a list if json data objects/dicts
        """
        amount = utils.validate_amount(amount)

        if not email:
            raise InvalidDataError("Customer's Email is required for initialization")

        url = self._url("/initialize")
        payload = {
            "email": email,
            "amount": amount,
        }

        return self._handle_request("POST", url, payload)

    def verify(self, reference):
            """
            Verifies a transaction using the provided reference number
            args:
            reference -- reference of the transaction to verify
            """

            reference = str(reference)
            url = self._url("/transaction/verify/{}".format(reference))
            return self._handle_request("GET", url)
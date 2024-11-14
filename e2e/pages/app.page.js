import metamask from '@synthetixio/synpress/commands/metamask.js';

class AppPage {
    constructor(page) {
        this.page = page;
        this.connectButton = 'button[data-test="MetaMaskConnector__Button__connect"]';
        this.connectedDiv = 'div[data-test="MetaMaskConnector__Div__connect"]';
        this.errorDiv = '[data-test="MetaMaskConnector__Div__error"]';
        this.addressInput = 'input[data-test="InputAddress__Input__addressValue"]';
        this.submitButton = 'button[data-test="InputAddress__Button__submit"]';
        this.balanceDiv = 'div[data-test="TokenBalance__Div__balanceInfo"]';
        this.depositHistoryTable = 'table[data-test="DepositHistory__Table__history"]';
        this.exampleTokenLink = 'span[data-test="InputAddress__Span__exampleTokenLink"]';
        this.totalAmount = 'td[class="text-right"]';
        this.inputErrorMessage = '[data-test="DepositToken__Div__error"]';
        this.depositButton = 'button[data-test="DepositToken__Button__deposit"]';
        this.mintMoreTokensLink = '[data-test="TokenBalance__Div__getMoreExampleTokensAction"]'
    }

    async openApp() {
        await this.page.goto(global.BASE_URL);
    }

    async connectWallet() {
        await this.page.locator(this.connectButton).click();
        await this.page.reload();
    }

    async acceptNotifications() {
        await metamask.acceptAccess();
    }

    async getWalletAddress() {
        return await metamask.getWalletAddress();
    }

    async verifyWalletAddressDisplayed(expectedAddress, shouldShow = true) {
        const addressDiv = this.page.locator(this.connectedDiv);
        if (shouldShow) {
            await global.expect(addressDiv).toContainText(expectedAddress.toLowerCase());
        } else {
            await global.expect(addressDiv).not.toContainText(expectedAddress.toLowerCase());
        }
    }

    async verifyAddressInputVisible(shouldBeVisible = true) {
        const addressInput = this.page.locator(this.addressInput);
        if (shouldBeVisible) {
            await global.expect(addressInput).toBeVisible({ timeout: 9000 });
        } else {
            await global.expect(addressInput).not.toBeVisible({ timeout: 9000 });
        }
    }

    async checkNetworkErrorIsPresent(isErrorExpected) {
        const errorDiv = this.page.locator(this.errorDiv);
        if (isErrorExpected) {
            await global.expect(errorDiv).toBeVisible();
        } else {
            await global.expect(errorDiv).not.toBeVisible();
        }
    }

    async getCurrentNetwork() {
        // Usar la API de MetaMask para obtener la red actual
        const network = await this.page.evaluate(async () => {
            if (window.ethereum) {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                switch (chainId) {
                    case '0x1':
                        return 'mainnet';
                    case '0x3':
                        return 'ropsten';
                    case '0x4':
                        return 'rinkeby';
                    case '0x5':
                        return 'goerli';
                    case '0x2a':
                        return 'kovan';
                    case '0xaa36a7':
                        return 'sepolia';
                    default:
                        return 'unknown';
                }
            }
            return null;
        });

        return network;
    }

    async enterAddress(address) {
        await this.page.fill(this.addressInput, address);
    }

    async clickSubmitButton() {
        await this.page.locator(this.submitButton).click();
    }

    async verifyBalanceIsDisplayed() {
        await global.expect(this.page.locator(this.balanceDiv)).toBeVisible();
    }

    async verifyDepositHistoryIsDisplayed() {
        await global.expect(this.page.locator(this.depositHistoryTable)).toBeVisible();
    }

    async clickExampleTokenLink() {
        await this.page.locator(this.exampleTokenLink).click();
    }

    async getDepositHistoryTotalAmount() {
        return await this.page.locator(this.depositHistoryTable).locator(this.totalAmount).innerText();
    }

    async verifyInputErrorMessage() {
        await global.expect(this.page.locator(this.inputErrorMessage)).toBeVisible();
    }

    async clickDepositButton() {
        await this.page.locator(this.depositButton).click();
    }

    async verifyDepositButtonVisible(shouldBeVisible = true) {
        const depositButton = this.page.locator(this.depositButton);
        if (shouldBeVisible) {
            await global.expect(depositButton).toBeVisible();
        } else {
            await global.expect(depositButton).not.toBeVisible();
        }
    }

    async clickMintMoreTokensLink() {
        await this.page.locator(this.mintMoreTokensLink).click();
    }
}

export default AppPage;
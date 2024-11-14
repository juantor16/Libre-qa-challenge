import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import metamask from '@synthetixio/synpress/commands/metamask.js';
import AppPage from '../../pages/app.page.js';

setDefaultTimeout(60 * 1000);
let appPage;


Given(/^A user with metamask installed connected to (sepolia|mainnet) network$/, async function (network) {
    appPage = new AppPage(global.page);

    // Verificar si MetaMask está instalada
    const extensionDetails = await metamask.getExtensionDetails();
    if (!extensionDetails || !extensionDetails.extensionId) {
        console.error("MetaMask is not installed. Please install MetaMask first.");
        process.exit(1);
    } else {
        console.log("MetaMask is installed, proceeding with tests...");
    }

    await global.expect(extensionDetails).not.toBe(null);

    // Obtener la red actual utilizando la función `getCurrentNetwork`
    const currentNetwork = await appPage.getCurrentNetwork();
    console.log("Current network:", currentNetwork);

    // Cambiar la red si no coincide con la deseada
    if (currentNetwork !== network) {
        console.log(`Switching network to ${network}`);
        await metamask.changeNetwork(network);
        await global.page.reload();

        // Verificar que el cambio de red fue exitoso
        const newNetwork = await appPage.getCurrentNetwork();
        console.log("New network:", newNetwork);
        if (newNetwork !== network) {
            throw new Error(`Failed to switch to ${network} network`);
        }
    } else {
        console.log(`Already connected to the ${network} network`);
    }
});

When(/^the user accesses the app page$/, async function () {
    console.log("Opening app page...");
    await appPage.openApp();
    console.log("App page opened.");
    await metamask.acceptAccess();
    console.log("Access accepted.");
    await global.page.reload();
    console.log("Page reloaded.");
});


When(/^the user accepts notifications$/, async function () {
    // await appPage.acceptNotifications();
    // await appPage.connectWallet();
});

Then(/^the page (shows|doesn't show) the account address$/, async function (shouldShow) {
    const walletAddress = await metamask.getWalletAddress();
    const isDisplayed = (shouldShow === 'shows');
    await appPage.verifyWalletAddressDisplayed(walletAddress, isDisplayed);
});

Then(/^the page (shows|doesn't show) the input address field$/, async function (shouldShow) {
    const isVisible = (shouldShow === 'shows');
    await appPage.verifyAddressInputVisible(isVisible);
});

Then(/^the page (doesn't show|shows) a network error message$/, async function (condition) {
    const isErrorExpected = condition === 'shows';
    await appPage.checkNetworkErrorIsPresent(isErrorExpected);
});

//the page shows the switch network button
When(/^the page shows the switch network button$/, async function () {
    const button = global.page.locator(appPage.connectButton);

    await button.waitFor({ state: 'visible' });

    await global.expect(button).toHaveText('Connect Metamask to Sepolia');
});

//the user clicks the switch network button
When(/^the user clicks the switch network button$/, async function () {
    await global.page.locator(appPage.connectButton).click();
});

// the user switches network
When(/^the user confirms the switch network$/, async function () {
    const previousNetwork = await appPage.getCurrentNetwork();
    console.log("Previous network: ", previousNetwork);

    // Confirmar el cambio de red en MetaMask
    await metamask.allowToSwitchNetwork();
    console.log("Network switch confirmed.");

    await global.page.reload();

    const newNetwork = await appPage.getCurrentNetwork();
    console.log("New network: ", newNetwork);

    // Verificar que la red ha cambiado
    if (newNetwork) {
        global.expect(newNetwork).not.toEqual(previousNetwork);
    } else {
        console.error("Could not retrieve the new network");
    }
});

When(/^the user enters the address (.*) in the input address field$/, async function (accountAddress) {
    // Usamos el valor que se pasó en el archivo .feature
    await appPage.enterAddress(accountAddress);
});

When(/^the user clicks the Submit button$/, async function () {
    await appPage.clickSubmitButton();
});

Then(/^the page shows the address balance for the selected token$/, async function () {
    await appPage.verifyBalanceIsDisplayed();
});

Then(/^the page shows the table of the deposit history for the selected token$/, async function () {
    await appPage.verifyDepositHistoryIsDisplayed();
});

//the submit button is disabled
Then(/^the submit button is disabled$/, async function () {
    const submitButton = global.page.locator(appPage.submitButton);

    await global.expect(submitButton).toBeDisabled();
});

//the user clicks the example token link
When(/^the user clicks the example token link$/, async function () {
    await appPage.clickExampleTokenLink()
});

//Then the page shows the token balance 0
Then(/^the page shows the token balance (.*)$/, async function (balance) {
    const tokenBalance = await appPage.getDepositHistoryTotalAmount();
    await global.expect(tokenBalance).toEqual(balance);
});

Then(/^the deposit button (is|is not) visible$/, async function (condition) {
    const shouldBeVisible = condition === 'is';
    await appPage.verifyDepositButtonVisible(shouldBeVisible);
});

Then(/^the deposit input shows an error$/, async function () {
    await appPage.verifyInputErrorMessage();
});

// When the user clicks the Mint more tokens link
When(/^the user clicks the Mint more tokens link$/, async function () {
    await appPage.clickMintMoreTokensLink();
});

// When the user accepts the transaction
When(/^the user accepts the transaction$/, async function () {
    await metamask.confirmTransaction();
});
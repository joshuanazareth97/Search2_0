# **PostHuman**

Posthuman uses AI to generate custom responses to any query, better than human answers.

[Visit the Demo Site!](http://posthumanai.network/)

<br />

- [**PostHuman**](#posthuman)
  - [**Problem**](#problem)
  - [**Solution**](#solution)
  - [**Integrations**](#integrations)
  - [**How to Run**](#how-to-run)

<br />

---

<br />

## **Problem**

Today, all information retrieval on the Internet relies on keyword search, across ever growing datasets of billions of documents and websites

<br />

## **Solution**

Posthuman Network uses a custom-trained GPT-3 model which is fine tuned using behavior cloning, and then
performing rejection sampling against a reward model trained to predict human preferences. <br />

Today, all information retrieval on the Internet relies on keyword search, across ever growing datasets of billions of documents and websites.

<br />

## **Integrations**

- [ Solana ](https://solana.com/) and [Slope Wallet](https://slope.finance/) power the automated micropayments system. 🪙
- Automated request pricing in SOL using [Serum's API](https://www.projectserum.com/). 📈

<br />

## **How to Run**

0. Install Docker

1. Clone this repository

   `git clone https://github.com/joshuanazareth97/Search2_0.git`

2. Make the deploy scripts executable

   `cd Search2_0/client && chmod +x ./deploy.sh`
   `cd Search2_0/gateway && chmod +x ./deploy.sh`

3. Run the deploy scripts (run these commands in separate shells in the root directory)

   `cd client && ./deploy.sh`
   `cd gateway && ./deploy.sh`

import React from 'react'
import "./prodBenifit.css"
const productBenifit = () => {
  return (
    <div>
{/* <!-- header section ends -->

<!-- home section starts  --> */}

<section class="home" id="home">

    <div class="content">
        <h3>Dairy Products Benifts</h3>
        <p>Foods in the Dairy Group provide nutrients that are vital for health and maintenance of your body. These nutrients include calcium, potassium, vitamin D, and protein.</p>
        <a href="https://sheerghar.blogspot.com/" class="btn">Read Our Blog</a>
    </div>

    <div class="image">
        <img src="images/home-img.png" alt="" />
    </div>

</section>

{/* <!-- home section ends -->

<!-- speciality section starts  --> */}

<section class="speciality" id="speciality">

    <h1 class="heading"> Products  <span>Benifits</span> </h1>

    <div class="box-container">

        <div class="box">
            <img class="image" src="images/s-img-1.jpg" alt="" />
            <div class="content">
                <h3>Cheese Can Prevent Osteoporosis</h3>
                <p>Our parents always instructed us to drink our milk as children, telling us that the calcium and vitamin D would help us to build strong bones. The truth is our bone mass continues to grow throughout childhood and adolescence, reaching its peak density around age 30. From there, the aging process begins to thin our bones over tim</p>
            </div>
        </div>
        <div class="box">
            <img class="image" src="images/s-img-2.jpg" alt="" />
            <div class="content">   
                <h3>Milk Can Prevent lactic disorder</h3>
                <p>Our parents always instructed us to drink our milk as children, telling us that the calcium and vitamin D would help us to build strong bones. The truth is our bone mass continues to grow throughout childhood and adolescence, reaching its peak density around age 30. From there, the aging process begins to thin our bones over tim</p>
            </div>
        </div>
        <div class="box">
            <img class="image" src="images/s-img-3.jpg" alt="" />
            <div class="content">
                <h3>Juices Can Provide Required Vitamins </h3>
                <p>Our parents always instructed us to drink our milk as children, telling us that the calcium and vitamin D would help us to build strong bones. The truth is our bone mass continues to grow throughout childhood and adolescence, reaching its peak density around age 30. From there, the aging process begins to thin our bones over tim</p>
            </div>
        </div>

    </div>

</section>
<div class="step-container">

    <h1 class="heading">How SheerGhar System <span>Works</span></h1>

    <section class="steps">

        <div class="box">
            <h3>Collect Dairy form local distributor </h3>
        </div>
        <div class="box">
            <h3>Check For The Quaity</h3>
        </div>
        <div class="box">
            <h3>Preserve The Product</h3>
        </div>
        <div class="box">
            <h3>Dispatch To Our Valueable Customers</h3>
        </div>
    
    </section>

</div>
    </div>
  )
}

export default productBenifit
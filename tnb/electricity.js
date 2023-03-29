function calculateBill() {
    const tariff = {
      "t1_rate": 21.8,   // sen/kWh for first 200 kWh
      "t2_rate": 33.4,   // sen/kWh for next 100 kWh
      "t3_rate": 51.6,   // sen/kWh for next 300 kWh
      "t4_rate": 54.6,   // sen/kWh for next 300 kWh
      "t5_rate": 57.1,   // sen/kWh for remaining kWh
      "min_charge": 3.0  // RM minimum monthly charge
    };
    const usageInput = document.getElementById("usage");
    const usage = parseFloat(usageInput.value);
    
    let bill;
    if (usage <= 200) {
      bill = usage * tariff["t1_rate"];
    } else if (usage <= 300) {
      bill = 200 * tariff["t1_rate"] + (usage - 200) * tariff["t2_rate"];
    } else if (usage <= 600) {
      bill = 200 * tariff["t1_rate"] + 100 * tariff["t2_rate"] + (usage - 300) * tariff["t3_rate"];
    } else if (usage <= 900) {
      bill = 200 * tariff["t1_rate"] + 100 * tariff["t2_rate"] + 300 * tariff["t3_rate"] + (usage - 600) * tariff["t4_rate"];
    } else {
      bill = 200 * tariff["t1_rate"] + 100 * tariff["t2_rate"] + 300 * tariff["t3_rate"] + 300 * tariff["t4_rate"] + (usage - 900) * tariff["t5_rate"];
    }
  
    bill = Math.max(bill, tariff["min_charge"] * 100) / 100.0;  // convert to RM with 2 decimal places
    const icpt = -2 * usage / 100.0;
    let st, total_bill;
    if (usage > 600) {
      st = 0.06 * (bill + icpt);
      total_bill = bill + icpt + st;
    } else {
      st = 0;
      total_bill = bill + icpt;
    }
    const kwtbb = 0.016 * (total_bill - icpt - st);
    const total_bill_with_kwtbb = total_bill + kwtbb;
  
    const billAmount = document.getElementById("billAmount");
    const icptAmount = document.getElementById("icpt");
    const serviceTaxAmount = document.getElementById("serviceTax");
    const kwtbbAmount = document.getElementById("kwtbb");
    const totalBillAmount = document.getElementById("totalBill");
  
    billAmount.innerHTML = "Estimated Bill : RM"+bill.toFixed(2);
    icptAmount.innerHTML = "ICPT: RM"+icpt.toFixed(2);
    serviceTaxAmount.innerHTML = "Service Tax(6%): RM"+st.toFixed(2);
    kwtbbAmount.innerHTML = "KWTBB: RM"+kwtbb.toFixed(2);
    totalBillAmount.innerHTML = "Your total bill inclusive of Service Tax, ICPT, and KWTBB is : RM"+total_bill_with_kwtbb.toFixed(2);
  }
  
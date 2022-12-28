/**
 *
 */
package com.fpoly.restcontrollers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import com.fpoly.dto.BookingRoomDTO;
import com.fpoly.dto.BookingRoomResponseDTO;
import com.fpoly.dto.CheckInBookingDTO;
import com.fpoly.entities.*;
import com.fpoly.repositories.irepo.*;
import com.fpoly.repositories.repo.BillRepository;
import com.fpoly.repositories.repo.BookingRepository;
import com.fpoly.repositories.repo.DetailInvoiceRepository;
import com.fpoly.repositories.repo.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/booking")
public class BookingController {

	@Autowired IBillService iBillService;
	@Autowired IDetailInvoiceService iDetailInvoiceService;

	@Autowired DetailInvoiceRepository detailInvoiceRepository;
	@Autowired ICustomerService iCustomerService;
	@Autowired IPersonnelService iPersonnelService;
	@Autowired IRentalTypeService iRentalTypeService;
	@Autowired IBookingService iBookingService;

    @Transactional
    @GetMapping("/get-list-booking-paid")
    public ResponseEntity<?> getListBookingPaid() {
        return new ResponseEntity<>(iBookingService.getAllBookingPaid(), HttpStatus.OK);
    }

	@Transactional
	@GetMapping("/get-list-booking-unpaid")
	public ResponseEntity<?> getListBookingUnPaid() {
		return new ResponseEntity<>(iBookingService.getAllBookingUnPaid(), HttpStatus.OK);
	}

	@Transactional
	@GetMapping("/get-list-booking-cancel")
	public ResponseEntity<?> getListBookingCancel() {
		return new ResponseEntity<>(iBookingService.getAllBookingCancel(), HttpStatus.OK);
	}

	@Transactional
	@GetMapping("/get-room-booking-list/{idBooking}")
	public ResponseEntity<?> getRoomBookingList(@PathVariable Integer idBooking) {
		List<DetailsInvoice> roomBookingList = new ArrayList<>();
		Bills bills = iBillService.getBillByIdBooking(idBooking);
		if(bills != null) {
			roomBookingList = iDetailInvoiceService.getDetailInvoiceByIdBill(bills.getId());
		}
		return new ResponseEntity<>(roomBookingList, HttpStatus.OK);
	}

	@GetMapping("/get-bill-by-booking/{idBooking}")
	public ResponseEntity<?> getBillByBooking(@PathVariable Integer idBooking) {
		return new ResponseEntity<>(iBillService.getBillByIdBooking(idBooking), HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/booking-room")
	public ResponseEntity<?> getRoomBookingList(@RequestBody BookingRoomDTO bookingRoomDTO) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

		Booking booking = iBookingService.save(bookingRoomDTO.getBooking());

		Bills bills = new Bills();

		if(bookingRoomDTO.getBills() != null){
			bills = bookingRoomDTO.getBills();
		} else {
			Customer newCustomer = new Customer();
			newCustomer.setFullname(booking.getCustomerName());
			newCustomer.setEmail(booking.getCustomerEmail());
			newCustomer.setPhoneNumber(booking.getCustomerPhoneNumber());
			newCustomer.setStatus(1);

			Customer customer = iCustomerService.save(newCustomer);

			Personnel personnel = iPersonnelService.getPersonnelByUserName(bookingRoomDTO.getUserNamePersonnel());

			Bills newBill = new Bills();
			newBill.setCustomer(customer);
			newBill.setPersonnel(personnel);
			newBill.setNumberOfAdults(booking.getNumberOfAdults());
			newBill.setNumberOfKids(booking.getNumberOfKids());
			newBill.setHireDate(LocalDateTime.now());
			newBill.setDeposits(booking.getDeposits());
			newBill.setStatus(3);
			newBill.setBooking(booking);

			bills = iBillService.save(newBill);
		}
		DetailsInvoice newDetailInvoice = new DetailsInvoice();
		newDetailInvoice.setBills(bills);
		newDetailInvoice.setRooms(bookingRoomDTO.getRooms());

		Optional<RentalTypes> rentalTypes = iRentalTypeService.findById(1);

		newDetailInvoice.setRentalTypes(rentalTypes.get());
		newDetailInvoice.setHireDate(LocalDateTime.parse(bookingRoomDTO.getHireDate(), formatter));
		newDetailInvoice.setCheckOutDay(LocalDateTime.parse(bookingRoomDTO.getCheckOutDay(), formatter));
		newDetailInvoice.setStatus(3);

		DetailsInvoice detailsInvoice = iDetailInvoiceService.save(newDetailInvoice);

		BookingRoomResponseDTO bookingRoomResponseDTO = new BookingRoomResponseDTO(bills, detailsInvoice);

		return new ResponseEntity<>(bookingRoomResponseDTO, HttpStatus.OK);
	}

	@Transactional
	@GetMapping("/delete-booking-room/{idDetailInvoice}")
	public ResponseEntity<?> deleteBookingRoom(@PathVariable Integer idDetailInvoice) {
		iDetailInvoiceService.remove(idDetailInvoice);
		return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/check-in-booking")
	public ResponseEntity<?> checkInBooking(@RequestBody CheckInBookingDTO checkInBookingDTO) {

		checkInBookingDTO
				.getDataBill()
				.setCustomer(iCustomerService.save(checkInBookingDTO.getDataBill().getCustomer()));

		checkInBookingDTO
				.getDataBill()
				.setBooking(iBookingService.save(checkInBookingDTO.getDataBill().getBooking()));

		iBillService.save(checkInBookingDTO.getDataBill());

		detailInvoiceRepository.saveAll(checkInBookingDTO.getRoomBookingList());

		return new ResponseEntity<>("Success", HttpStatus.OK);
	}

	@Transactional
	@PostMapping
	public ResponseEntity<?> saveBooking(@RequestBody Booking booking) {
		if(booking.getStatus() == 3) {
			Bills bills = iBillService.getBillByIdBooking(booking.getId());
			if(bills != null) {
				List<DetailsInvoice> detailsInvoiceList = iDetailInvoiceService.getDetailInvoiceByIdBill(bills.getId());
				if(detailsInvoiceList != null) {
					detailInvoiceRepository.deleteAll(detailsInvoiceList);
				}
				iBillService.remove(bills.getId());
			}
		}
		return new ResponseEntity<>(iBookingService.save(booking), HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/update-payment-status/{idBooking}")
	public ResponseEntity<?> updatePaymentStatus(@PathVariable Integer idBooking) {
		Booking booking = iBookingService.findById(idBooking).get();
		booking.setPaymentStatus(2);
		return new ResponseEntity<>(iBookingService.save(booking), HttpStatus.OK);
	}

	@Transactional
	@DeleteMapping("{idBooking}")
	public ResponseEntity<?> deleteBooking(@PathVariable Integer idBooking) {
		Booking booking = iBookingService.findById(idBooking).get();
		iBookingService.remove(idBooking);
		return new ResponseEntity<>(booking, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/customer-payment")
	public ResponseEntity<?> customerPayment(@RequestBody Booking booking) {
		return new ResponseEntity<>(iBookingService.save(booking), HttpStatus.OK);
	}
}

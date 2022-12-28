package com.fpoly.restcontrollers;

import com.fpoly.dto.*;
import com.fpoly.entities.*;
import com.fpoly.repositories.irepo.*;
import com.fpoly.repositories.repo.DetailInvoiceRepository;
import com.fpoly.repositories.repo.RoomRepository;
import com.fpoly.repositories.repo.ServiceDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/room-rental-manage")
public class RoomRentalManageController {

    @Autowired IRoomService iRoomService;
    @Autowired IDetailInvoiceService iDetailInvoiceService;
    @Autowired IFacilityService iFacilityService;
    @Autowired IServiceAvailableService iServiceAvailableService;
    @Autowired IFacilityDetailService iFacilityDetailService;
    @Autowired IBillService iBillService;
    @Autowired ICustomerService iCustomerService;
    @Autowired IServiceDetailService iServiceDetailService;
    @Autowired DetailInvoiceRepository detailInvoiceRepository;
    @Autowired RoomRepository roomRepository;
    @Autowired ServiceDetailRepository serviceDetailRepository;

    @Transactional
    @GetMapping("/get-room-plan/{dateChoose}")
    public ResponseEntity<?> getRoomPlan(@PathVariable String dateChoose) {
        List<Rooms> rooms = (List<Rooms>) iRoomService.findAll();

//        List<RoomAndBillDto> roomAndBillArrayList = new ArrayList<>();
        List<RoomDetailDTO> roomDetailDTOList = new ArrayList<>();

        for (Rooms r : rooms) {
            RoomDetailDTO romDetailDTO = new RoomDetailDTO();
//            romDetailDTO.setRooms(r);
//            DetailsInvoice detailsInvoice = iDetailInvoiceService.findByRoomsAndStatus(r, 1);
            List<DetailsInvoice> detailInvoiceList = iDetailInvoiceService.getListDetailInvoiceByDate(r.getId(), dateChoose);

            int statusByDate = r.getStatus();

            if (detailInvoiceList != null) {
                romDetailDTO.setDetailInvoiceList(detailInvoiceList);
                for (DetailsInvoice d : detailInvoiceList){
                    if(d.getStatus() == 1) {
                        romDetailDTO.setServiceDetailsList(iServiceDetailService.listByRoomAndStatus(d, 1));
                        statusByDate = 2;
                    }
                }
            } else {
                romDetailDTO.setDetailInvoiceList(null);
            }

            List<FacilitiesDetails> facilitiesDetailsList = iFacilityDetailService.findByRoomsAndStatus(r, 1);
            if (facilitiesDetailsList != null) {
                romDetailDTO.setFacilitiesDetailsList(facilitiesDetailsList);
            } else {
                romDetailDTO.setFacilitiesDetailsList(null);
            }

            List<ServiceAvailable> serviceAvailableList = iServiceAvailableService.findByRoomsAndStatus(r, 1);
            if (serviceAvailableList != null) {
                romDetailDTO.setServiceAvailableList(serviceAvailableList);
            } else {
                romDetailDTO.setServiceAvailableList(null);
            }
            romDetailDTO.setRooms(r.toRoomByDate(statusByDate));
            roomDetailDTOList.add(romDetailDTO);
//            DetailsInvoice detailsInvoice = repositoryIDetailInvoiceService.findByRoomsAndStatus(r, 0);
//            RoomAndBillDto roomAndBill = new RoomAndBillDto();
//            roomAndBill.setRooms(r);
//            if (detailsInvoice != null) {
//                roomAndBill.setDetailsInvoice(detailsInvoice);
//            } else {
//                roomAndBill.setDetailsInvoice(null);
//            }
//            roomAndBillArrayList.add(roomAndBill);
        }
        Map<Integer, List<RoomDetailDTO>> roomPlan = roomDetailDTOList.stream().collect(Collectors.groupingBy(r -> r.getRooms().getNumberOfFloors().getNumberOfFloors()));

        List<RoomPlanDTO> roomPlanDTOList = new ArrayList<>();

        for (Integer numberOfFloors : roomPlan.keySet()) {
            RoomPlanDTO r = new RoomPlanDTO();
            r.setNumberOfFloors(numberOfFloors);
            r.setListRoom(roomPlan.get(numberOfFloors));
            roomPlanDTOList.add(r);
        }

        return new ResponseEntity<>(roomPlanDTOList, HttpStatus.OK);
    }

    @GetMapping("/all-bill-active")
    public ResponseEntity<?> getAllCustomerAreRenting(){
        List<Bills> billActiveList = iBillService.getAllBillByStatus(1);
        return new ResponseEntity<>(billActiveList, HttpStatus.OK);
    }

    @PostMapping("/check-in")
    @Transactional
    public ResponseEntity<?> checkInManyRooms(@RequestBody CheckInDTO checkInDTO) {

        //Create customer
        Customer customer = iCustomerService.save(checkInDTO.getCustomer());

        //Create bills
        checkInDTO.getBill().setCustomer(customer);
        Bills bill = iBillService.save(Bills.toEntity(checkInDTO.getBill()));

        //Create all details invoice
        List<DetailsInvoice> detailsInvoiceList = new ArrayList<>();
        for (DetailsInvoiceDTO d : checkInDTO.getDetailInvoices()){
            DetailsInvoice detailsInvoice = DetailsInvoice.toEntity(d);
            detailsInvoice.setBills(bill);
            detailsInvoiceList.add(detailsInvoice);
        }
        List<DetailsInvoice> detailsInvoiceListSave = detailInvoiceRepository.saveAll(detailsInvoiceList);

        //Create all service
        List<ServiceDetails> serviceDetailsList = new ArrayList<>();
        if(checkInDTO.getServiceDetails().size() > 0){
            for (ServiceDetailsDTO svd : checkInDTO.getServiceDetails()){
                ServiceDetails serviceDetails = ServiceDetails.toEntity(svd);
                for (DetailsInvoice dti : detailsInvoiceListSave){
                    if(dti.getRooms().getId() == svd.getDetailsInvoice().getRooms().getId()){
                        serviceDetails.setDetailsInvoice(dti);
                    }
                }
                serviceDetailsList.add(serviceDetails);
            }
        }
        List<ServiceDetails> serviceDetailsListSave = serviceDetailRepository.saveAll(serviceDetailsList);

        CheckInResponseDTO checkInResponseDTO = new CheckInResponseDTO();
        checkInResponseDTO.setCustomer(customer);
        checkInResponseDTO.setBill(bill);
        checkInResponseDTO.setDetailsInvoiceList(detailsInvoiceListSave);
        checkInResponseDTO.setServiceDetailsList(serviceDetailsListSave);
        return new ResponseEntity<>(checkInResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getDetailsByTheRoomIsInUse(@PathVariable Integer id){
        Optional<Rooms> rooms = iRoomService.findById(id);
        DetailsInvoice detailsInvoiceByRoom = iDetailInvoiceService.findByRoomsAndStatus(rooms.get(), 1);
        Bills bills = detailsInvoiceByRoom.getBills();
        List<DetailsInvoice> detailsInvoiceList = iDetailInvoiceService.findByBillsAndStatus(detailsInvoiceByRoom.getBills().getId());
        List<ServiceDetails> serviceDetailsList = new ArrayList<>();
        for (DetailsInvoice d : detailsInvoiceList) {
            serviceDetailsList.addAll(iServiceDetailService.listByRoomAndStatus(d, 1));
        }
        List<DetailInvoiceAndRoomUtilDTO> detailInvoiceAndRoomUtilDTOList = new ArrayList<>();
        int key = 0;
        for (DetailsInvoice d : detailsInvoiceList) {
            List<FacilitiesDetails> facilitiesDetailsList = iFacilityDetailService.findByRoomsAndStatus(d.getRooms(), 1);
            List<ServiceAvailable> serviceAvailableList = iServiceAvailableService.findByRoomsAndStatus(d.getRooms(), 1);
            DetailInvoiceAndRoomUtilDTO detailInvoiceAndRoomUtilDTO = DetailInvoiceAndRoomUtilDTO.toDTO(d, facilitiesDetailsList, serviceAvailableList, key);
            detailInvoiceAndRoomUtilDTOList.add(detailInvoiceAndRoomUtilDTO);
            key++;
        }
        DetailsByTheRoomIsInUseDTO detailsByTheRoomIsInUseDTO = new DetailsByTheRoomIsInUseDTO(rooms.get(), bills, detailInvoiceAndRoomUtilDTOList, serviceDetailsList);
        return new ResponseEntity<>(detailsByTheRoomIsInUseDTO, HttpStatus.OK);
    }

    @PostMapping("/update-detail")
    @Transactional
    public ResponseEntity<?> updateDetail(@RequestBody CheckInDTO checkInDTO){
        iCustomerService.save(checkInDTO.getCustomer());
        iBillService.save(Bills.toEntity(checkInDTO.getBill()));
        List<DetailsInvoice> detailsInvoiceList = new ArrayList<>();
        List<Rooms> roomsList = new ArrayList<>();
        for (DetailsInvoiceDTO d : checkInDTO.getDetailInvoices()){
            detailsInvoiceList.add(DetailsInvoice.toEntity(d));
            d.getRooms().setStatus(2);
            roomsList.add(d.getRooms());
        }
//        roomRepository.saveAll(roomsList);
        List<DetailsInvoice> detailsInvoiceResponse = detailInvoiceRepository.saveAll(detailsInvoiceList);
        List<ServiceDetails> serviceDetailsList = new ArrayList<>();
        List<ServiceDetails> serviceDetailsListRemove = new ArrayList<>();
        for (ServiceDetailsDTO s : checkInDTO.getServiceDetails()){
            if(s.getQuantity() == 0){
                serviceDetailsListRemove.add(ServiceDetails.toEntity(s));
            }else if(s.getId() == 0) {
                for (DetailsInvoice d : detailsInvoiceResponse) {
                    if(d.getRooms().getId() == s.getDetailsInvoice().getRooms().getId()){
                        s.setDetailsInvoice(d.toDomain());
                        serviceDetailsList.add(ServiceDetails.toEntity(s));
                    }
                }
            } else  {
                serviceDetailsList.add(ServiceDetails.toEntity(s));
            }
        }
        serviceDetailRepository.saveAll(serviceDetailsList);
        if(serviceDetailsListRemove.size() > 0){
            serviceDetailRepository.deleteAll(serviceDetailsListRemove);
        }
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @PostMapping("/pay")
    @Transactional
    public ResponseEntity<?> pay(@RequestBody CheckInDTO checkInDTO){
        List<DetailsInvoice> detailsInvoiceList = new ArrayList<>();
        List<Rooms> roomsList = new ArrayList<>();
        for (DetailsInvoiceDTO d : checkInDTO.getDetailInvoices()){
            detailsInvoiceList.add(DetailsInvoice.toEntity(d));
            d.getRooms().setStatus(3);
            roomsList.add(d.getRooms());
        }
        roomRepository.saveAll(roomsList);
        List<DetailsInvoice> detailsInvoiceResponse = detailInvoiceRepository.saveAll(detailsInvoiceList);
        List<ServiceDetails> serviceDetailsList = new ArrayList<>();
        List<ServiceDetails> serviceDetailsListRemove = new ArrayList<>();
        for (ServiceDetailsDTO s : checkInDTO.getServiceDetails()){
            if(s.getQuantity() == 0){
                serviceDetailsListRemove.add(ServiceDetails.toEntity(s));
            }else if(s.getId() == 0) {
                for (DetailsInvoice d : detailsInvoiceResponse) {
                    if(d.getRooms().getId() == s.getDetailsInvoice().getRooms().getId()){
                        s.setDetailsInvoice(d.toDomain());
                        serviceDetailsList.add(ServiceDetails.toEntity(s));
                    }
                }
            } else  {
                serviceDetailsList.add(ServiceDetails.toEntity(s));
            }
        }
        serviceDetailRepository.saveAll(serviceDetailsList);
        if(serviceDetailsListRemove.size() > 0){
            serviceDetailRepository.deleteAll(serviceDetailsListRemove);
        }
        Bills bill = Bills.toEntity(checkInDTO.getBill());
        bill.setStatus(2);
        iBillService.save(bill);
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @PutMapping("/clear-the-room/{id}")
    @Transactional
    public ResponseEntity<?> pay(@PathVariable Integer id){
        Optional<Rooms> room = iRoomService.findById(id);
        room.get().setStatus(1);
        return new ResponseEntity<>(iRoomService.save(room.get()) , HttpStatus.OK);
    }

    @GetMapping("/all-detail-invoice-by-room-and-status/{id}")
    public ResponseEntity<?> getAllDetailInvoieByRoomAndStatus(@PathVariable Integer id){
        return new ResponseEntity<>(iDetailInvoiceService.getAllDetailInvoiceByRoomAndStatus(id), HttpStatus.OK);
    }

    @GetMapping("/all-detail-invoice-by-room-and-status-and-date/{idRoom}/{date}")
    public ResponseEntity<?> getAllDetailInvoieByRoomAndStatusAndDate(@PathVariable Integer idRoom, @PathVariable String date){
        return new ResponseEntity<>(iDetailInvoiceService.getListDetailInvoiceByDate(idRoom, date), HttpStatus.OK);
    }

    @PostMapping("/pay-detail-invoice")
    public ResponseEntity<?> payDetailInvoice(@RequestBody DetailsInvoice detailsInvoice){
        iDetailInvoiceService.save(detailsInvoice);
        detailsInvoice.getRooms().setStatus(3);
        iRoomService.save(detailsInvoice.getRooms());
        return new ResponseEntity<>(iDetailInvoiceService.save(detailsInvoice), HttpStatus.OK);
    }
}
